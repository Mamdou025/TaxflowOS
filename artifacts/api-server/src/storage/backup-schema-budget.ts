import { z } from 'zod';
import { WorkflowLibrarySchema } from '@workspace/workflow-contracts/generated-schemas';
import { migrateWorkflowBackup } from '@workspace/workflow-contracts/library';

const MAX_VALIDATION_WORK = 500_000;

/** Bound Zod's repeated typed parsing/cloning without expanding opaque source evidence. */
export function assertBackupSchemaBudget(input: unknown): void {
  const memo = new WeakMap<z.ZodTypeAny, WeakMap<object, number>>();
  const lazy = new WeakMap<z.ZodTypeAny, z.ZodTypeAny>();
  const object = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === 'object' && !Array.isArray(value);
  function cost(schema: z.ZodTypeAny, value: unknown): number {
    const identity = value !== null && typeof value === 'object' ? value : undefined;
    const cached = identity && memo.get(schema)?.get(identity);
    if (cached !== undefined) return cached;
    let work = 1;
    const add = (amount: number) => {
      work += amount;
      if (work > MAX_VALIDATION_WORK) throw new Error('Backup validation exceeds its limits.');
    };
    switch (schema._def.typeName) {
      case z.ZodFirstPartyTypeKind.ZodLazy: {
        let inner = lazy.get(schema);
        if (!inner) {
          inner = (schema as z.ZodLazy<z.ZodTypeAny>).schema;
          lazy.set(schema, inner);
        }
        add(cost(inner, value));
        break;
      }
      case z.ZodFirstPartyTypeKind.ZodOptional:
        if (value !== undefined) add(cost((schema as z.ZodOptional<z.ZodTypeAny>).unwrap(), value));
        break;
      case z.ZodFirstPartyTypeKind.ZodNullable:
        if (value !== null) add(cost((schema as z.ZodNullable<z.ZodTypeAny>).unwrap(), value));
        break;
      case z.ZodFirstPartyTypeKind.ZodEffects:
        // Generated effects only normalize relationship strings and stored date strings.
        add(cost((schema as z.ZodEffects<z.ZodTypeAny>).innerType(), value));
        break;
      case z.ZodFirstPartyTypeKind.ZodArray:
        if (Array.isArray(value))
          for (const item of value) add(cost((schema as z.ZodArray<z.ZodTypeAny>).element, item));
        break;
      case z.ZodFirstPartyTypeKind.ZodObject:
        if (object(value)) {
          const target = schema as z.AnyZodObject;
          const shape = target.shape as z.ZodRawShape;
          // Zod scans/copies passthrough properties, but does not parse their contents.
          const keys = Object.keys(value);
          add(keys.length);
          for (const [key, child] of Object.entries(shape)) add(cost(child, value[key]));
          if (target._def.catchall._def.typeName !== z.ZodFirstPartyTypeKind.ZodNever)
            for (const key of keys)
              if (!Object.hasOwn(shape, key)) add(cost(target._def.catchall, value[key]));
        }
        break;
      case z.ZodFirstPartyTypeKind.ZodRecord:
        if (object(value)) {
          const target = schema as z.ZodRecord;
          for (const [key, item] of Object.entries(value)) {
            add(cost(target.keySchema, key));
            add(cost(target.valueSchema, item));
          }
        }
        break;
      case z.ZodFirstPartyTypeKind.ZodUnion:
        // A failed union can parse every branch. Charge their sum, not only a likely match.
        for (const option of (schema as z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>).options)
          add(cost(option, value));
        break;
      case z.ZodFirstPartyTypeKind.ZodIntersection: {
        const target = schema as z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>;
        add(cost(target._def.left, value));
        add(cost(target._def.right, value));
        break;
      }
      case z.ZodFirstPartyTypeKind.ZodUnknown:
      case z.ZodFirstPartyTypeKind.ZodAny:
      case z.ZodFirstPartyTypeKind.ZodNever:
      case z.ZodFirstPartyTypeKind.ZodString:
      case z.ZodFirstPartyTypeKind.ZodNumber:
      case z.ZodFirstPartyTypeKind.ZodBoolean:
      case z.ZodFirstPartyTypeKind.ZodDate:
      case z.ZodFirstPartyTypeKind.ZodLiteral:
      case z.ZodFirstPartyTypeKind.ZodNull:
      case z.ZodFirstPartyTypeKind.ZodUndefined:
      case z.ZodFirstPartyTypeKind.ZodEnum:
      case z.ZodFirstPartyTypeKind.ZodNativeEnum:
        break;
      default:
        // New contract schema kinds need an explicit cost model before admission.
        throw new Error('Unsupported backup validation schema.');
    }
    if (identity) {
      let values = memo.get(schema);
      if (!values) {
        values = new WeakMap<object, number>();
        memo.set(schema, values);
      }
      values.set(identity, work);
    }
    return work;
  }
  cost(WorkflowLibrarySchema, migrateWorkflowBackup(input));
}
