export type WorkflowToolbarProps = {
  workflowId?: string;
};

export const LOCAL_PUBLISH_STATUS_KEY = 'workflow-studio.publish-status';

export type LocalPublishStatus = 'draft' | 'published';
