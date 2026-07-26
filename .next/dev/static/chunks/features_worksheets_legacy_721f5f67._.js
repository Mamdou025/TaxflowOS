(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/worksheets/legacy/lib/t1134Data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── T1134 Mock Data ─────────────────────────────────────────────────────────
// 20 foreign affiliates across 5 countries for Northstar Inc.
// Reflects CRA T1134 (2021+) form structure: Part I Summary + Part II Supplement
__turbopack_context__.s([
    "COUNTRY_GROUPS",
    ()=>COUNTRY_GROUPS,
    "FOREIGN_AFFILIATES",
    ()=>FOREIGN_AFFILIATES,
    "PART_I_SUMMARY",
    ()=>PART_I_SUMMARY,
    "SOPHIA_IRL_QUESTIONS",
    ()=>SOPHIA_IRL_QUESTIONS
]);
const FOREIGN_AFFILIATES = [
    // ── 🇫🇷 France (4) ────────────────────────────────────────────────────────
    {
        id: 'fa-fr-01',
        shortName: 'SAS Paris',
        legalName: 'Northstar SAS Paris',
        country: 'France',
        countryCode: 'FRA',
        flag: '🇫🇷',
        tin: 'FR-84-123456789',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'FRA'
        ],
        taxCountries: [
            'FRA'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 100,
        commonSharesACB: 4200000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 1500000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'Yes',
        exemptSurplusDividend: 320000,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 320000,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '16-25',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 180,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 180000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 180000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 88,
        flags: [
            'FAPI > 0: confirm FAPIT entry'
        ],
        linkedToFapi: true
    },
    {
        id: 'fa-fr-02',
        shortName: 'SAS Lyon',
        legalName: 'Northstar SAS Lyon',
        country: 'France',
        countryCode: 'FRA',
        flag: '🇫🇷',
        tin: 'FR-84-987654321',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'FRA'
        ],
        taxCountries: [
            'FRA'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 100,
        commonSharesACB: 1800000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 500000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '6-15',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 45,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 45000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 45000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 72,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-fr-03',
        shortName: 'SAS Bordeaux',
        legalName: 'Northstar SAS Bordeaux',
        country: 'France',
        countryCode: 'FRA',
        flag: '🇫🇷',
        tin: 'FR-84-456789123',
        naicsCodes: [
            '551114'
        ],
        businessCountries: [
            'FRA',
            'BEL'
        ],
        taxCountries: [
            'FRA'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 75,
        commonSharesACB: 2100000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 75,
        equityPctEnd: 75,
        debtOwedToFA: 250000,
        debtOwedToFAOnT106: 'Yes',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'No',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '6-15',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 120,
        revRoyaltiesArmLength: 80,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 75,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 65,
        flags: [
            'Financial statements not included'
        ],
        linkedToFapi: false
    },
    {
        id: 'fa-fr-04',
        shortName: 'SCI Riviera',
        legalName: 'SCI Riviera Northstar',
        country: 'France',
        countryCode: 'FRA',
        flag: '🇫🇷',
        tin: 'FR-84-321654987',
        naicsCodes: [
            '531110'
        ],
        businessCountries: [
            'FRA'
        ],
        taxCountries: [
            'FRA'
        ],
        tier: 'NCFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 30,
        commonSharesACB: 890000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 30,
        equityPctEnd: 30,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'No',
        hasAtLeast20pctVoting: 'No',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '0',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 95,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 30,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 55,
        flags: [],
        linkedToFapi: false
    },
    // ── 🇩🇪 Germany (4) ───────────────────────────────────────────────────────
    {
        id: 'fa-de-01',
        shortName: 'GmbH Berlin',
        legalName: 'Northstar GmbH Berlin',
        country: 'Germany',
        countryCode: 'DEU',
        flag: '🇩🇪',
        tin: 'DE-811234567',
        naicsCodes: [
            '523110',
            '522110'
        ],
        businessCountries: [
            'DEU',
            'AUT'
        ],
        taxCountries: [
            'DEU'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 100,
        commonSharesACB: 6500000,
        acbIncrease: 'Yes',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 3200000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'Yes',
        exemptSurplusDividend: 580000,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 580000,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'Yes',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '26-100',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 320,
        revInterestArmLength: 150,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 470000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 320000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 150000,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 92,
        flags: [
            'ACB increased — confirm capital contribution details'
        ],
        linkedToFapi: true
    },
    {
        id: 'fa-de-02',
        shortName: 'GmbH Munich',
        legalName: 'Northstar GmbH München',
        country: 'Germany',
        countryCode: 'DEU',
        flag: '🇩🇪',
        tin: 'DE-819876543',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'DEU'
        ],
        taxCountries: [
            'DEU'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 100,
        commonSharesACB: 3100000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 800000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '16-25',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 80,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 80000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 80000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 80,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-de-03',
        shortName: 'GmbH Hamburg',
        legalName: 'Northstar GmbH Hamburg',
        country: 'Germany',
        countryCode: 'DEU',
        flag: '🇩🇪',
        tin: 'DE-812345678',
        naicsCodes: [
            '551114'
        ],
        businessCountries: [
            'DEU',
            'NLD'
        ],
        taxCountries: [
            'DEU'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 60,
        commonSharesACB: 1450000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 60,
        equityPctEnd: 60,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '6-15',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 60,
        revRoyaltiesArmLength: 40,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 60,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 70,
        flags: [],
        linkedToFapi: false
    },
    {
        id: 'fa-de-04',
        shortName: 'AG Frankfurt',
        legalName: 'Northstar AG Frankfurt',
        country: 'Germany',
        countryCode: 'DEU',
        flag: '🇩🇪',
        tin: 'DE-815678901',
        naicsCodes: [
            '522110'
        ],
        businessCountries: [
            'DEU',
            'CHE'
        ],
        taxCountries: [
            'DEU'
        ],
        tier: 'NCFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'EUR',
        directOwnershipPct: 25,
        commonSharesACB: 2200000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 10,
        preferredSharesACB: 400000,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 25,
        equityPctEnd: 25,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'No',
        financialStatementsIncluded: 'No',
        hasAtLeast20pctVoting: 'No',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'EUR',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '0',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'EUR',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 25,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 40,
        flags: [
            'Financial statements not available — IRL required'
        ],
        linkedToFapi: false
    },
    // ── 🇬🇧 UK (4) ────────────────────────────────────────────────────────────
    {
        id: 'fa-gb-01',
        shortName: 'Ltd London',
        legalName: 'Northstar Ltd London',
        country: 'United Kingdom',
        countryCode: 'GBR',
        flag: '🇬🇧',
        tin: 'GB-123456789',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'GBR'
        ],
        taxCountries: [
            'GBR'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'GBP',
        directOwnershipPct: 100,
        commonSharesACB: 8900000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 4500000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'Yes',
        exemptSurplusDividend: 920000,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 920000,
        totalDividendsStock: 0,
        dividendCurrency: 'GBP',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '26-100',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 450,
        revInterestArmLength: 200,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'GBP',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 650000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 450000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 200000,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 95,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-gb-02',
        shortName: 'Ltd Manchester',
        legalName: 'Northstar Ltd Manchester',
        country: 'United Kingdom',
        countryCode: 'GBR',
        flag: '🇬🇧',
        tin: 'GB-987654321',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'GBR'
        ],
        taxCountries: [
            'GBR'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'GBP',
        directOwnershipPct: 100,
        commonSharesACB: 2300000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 600000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'GBP',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '6-15',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 60,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'GBP',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 60000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 60000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 78,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-gb-03',
        shortName: 'Ltd Edinburgh',
        legalName: 'Northstar Ltd Edinburgh',
        country: 'United Kingdom',
        countryCode: 'GBR',
        flag: '🇬🇧',
        tin: 'GB-456789123',
        naicsCodes: [
            '551114'
        ],
        businessCountries: [
            'GBR'
        ],
        taxCountries: [
            'GBR'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'GBP',
        directOwnershipPct: 80,
        commonSharesACB: 1700000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 80,
        equityPctEnd: 80,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'GBP',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '6-15',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'GBP',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 80,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 68,
        flags: [],
        linkedToFapi: false
    },
    {
        id: 'fa-gb-04',
        shortName: 'LLP Bristol',
        legalName: 'Northstar LLP Bristol',
        country: 'United Kingdom',
        countryCode: 'GBR',
        flag: '🇬🇧',
        tin: 'GB-321654987',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'GBR',
            'IRL'
        ],
        taxCountries: [
            'GBR'
        ],
        tier: 'NCFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'GBP',
        directOwnershipPct: 40,
        commonSharesACB: 1100000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 40,
        equityPctEnd: 40,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'No',
        hasAtLeast20pctVoting: 'No',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'GBP',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '0',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'GBP',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 40,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 50,
        flags: [],
        linkedToFapi: false
    },
    // ── 🇺🇸 USA (4) ───────────────────────────────────────────────────────────
    {
        id: 'fa-us-01',
        shortName: 'Inc Delaware',
        legalName: 'Northstar Inc. Delaware',
        country: 'United States',
        countryCode: 'USA',
        flag: '🇺🇸',
        tin: 'US-EIN-12-3456789',
        naicsCodes: [
            '523110',
            '522110'
        ],
        businessCountries: [
            'USA'
        ],
        taxCountries: [
            'USA'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'USD',
        directOwnershipPct: 100,
        commonSharesACB: 12500000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 7800000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'Yes',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 1200000,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 1200000,
        totalDividendsStock: 0,
        dividendCurrency: 'USD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'Yes',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '100+',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 780,
        revInterestArmLength: 420,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'USD',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 1200000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 780000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 420000,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 90,
        flags: [
            'Upstream loan arrangement — confirm ss.90(6) application'
        ],
        linkedToFapi: true
    },
    {
        id: 'fa-us-02',
        shortName: 'Inc California',
        legalName: 'Northstar Inc. California',
        country: 'United States',
        countryCode: 'USA',
        flag: '🇺🇸',
        tin: 'US-EIN-98-7654321',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'USA'
        ],
        taxCountries: [
            'USA'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'USD',
        directOwnershipPct: 100,
        commonSharesACB: 5400000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 2100000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'USD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '26-100',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 210,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'USD',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 210000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 210000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 82,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-us-03',
        shortName: 'LLC Texas',
        legalName: 'Northstar LLC Texas',
        country: 'United States',
        countryCode: 'USA',
        flag: '🇺🇸',
        tin: 'US-EIN-45-6789012',
        naicsCodes: [
            '531110'
        ],
        businessCountries: [
            'USA'
        ],
        taxCountries: [
            'USA'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'USD',
        directOwnershipPct: 55,
        commonSharesACB: 3800000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 55,
        equityPctEnd: 55,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'USD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '16-25',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 380,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'USD',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 55,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 75,
        flags: [],
        linkedToFapi: false
    },
    {
        id: 'fa-us-04',
        shortName: 'Corp New York',
        legalName: 'Northstar Corp New York',
        country: 'United States',
        countryCode: 'USA',
        flag: '🇺🇸',
        tin: 'US-EIN-78-9012345',
        naicsCodes: [
            '522110'
        ],
        businessCountries: [
            'USA'
        ],
        taxCountries: [
            'USA'
        ],
        tier: 'NCFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'USD',
        directOwnershipPct: 20,
        commonSharesACB: 4100000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 5,
        preferredSharesACB: 200000,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 20,
        equityPctEnd: 20,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'No',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'USD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '0',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'USD',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 20,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 45,
        flags: [
            'Financial statements not included'
        ],
        linkedToFapi: false
    },
    // ── 🇸🇬 Singapore (4) ─────────────────────────────────────────────────────
    {
        id: 'fa-sg-01',
        shortName: 'Pte Singapore I',
        legalName: 'Northstar Pte. Ltd. Singapore I',
        country: 'Singapore',
        countryCode: 'SGP',
        flag: '🇸🇬',
        tin: 'SG-201234567K',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'SGP',
            'MYS'
        ],
        taxCountries: [
            'SGP'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'SGD',
        directOwnershipPct: 100,
        commonSharesACB: 9200000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 5500000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'Yes',
        exemptSurplusDividend: 1450000,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 1450000,
        totalDividendsStock: 0,
        dividendCurrency: 'SGD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '26-100',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 550,
        revInterestArmLength: 300,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'SGD',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 850000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 550000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 300000,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 93,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-sg-02',
        shortName: 'Pte Singapore II',
        legalName: 'Northstar Pte. Ltd. Singapore II',
        country: 'Singapore',
        countryCode: 'SGP',
        flag: '🇸🇬',
        tin: 'SG-209876543K',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'SGP'
        ],
        taxCountries: [
            'SGP'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'SGD',
        directOwnershipPct: 100,
        commonSharesACB: 3600000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 100,
        equityPctEnd: 100,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 1200000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'SGD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '6-15',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 120,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'SGD',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 100,
        fapiAmount: 120000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 120000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 85,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-sg-03',
        shortName: 'Pte Singapore III',
        legalName: 'Northstar Pte. Ltd. Singapore III',
        country: 'Singapore',
        countryCode: 'SGP',
        flag: '🇸🇬',
        tin: 'SG-204567890K',
        naicsCodes: [
            '551114'
        ],
        businessCountries: [
            'SGP',
            'IDN',
            'THA'
        ],
        taxCountries: [
            'SGP'
        ],
        tier: 'CFA',
        firstTimeFiling: 'No',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'SGD',
        directOwnershipPct: 70,
        commonSharesACB: 5100000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 70,
        equityPctEnd: 70,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 2800000,
        debtOwedFromFAOnT106: 'Yes',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'Yes',
        financialStatementsIncluded: 'Yes',
        hasAtLeast20pctVoting: 'Yes',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'SGD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '16-25',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 280,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'SGD',
        fapiEarned: 'Yes',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 70,
        fapiAmount: 196000,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 196000,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 88,
        flags: [],
        linkedToFapi: true
    },
    {
        id: 'fa-sg-04',
        shortName: 'Pte Singapore IV',
        legalName: 'Northstar Pte. Ltd. Singapore IV',
        country: 'Singapore',
        countryCode: 'SGP',
        flag: '🇸🇬',
        tin: 'SG-207654321K',
        naicsCodes: [
            '523110'
        ],
        businessCountries: [
            'SGP'
        ],
        taxCountries: [
            'SGP'
        ],
        tier: 'NCFA',
        firstTimeFiling: 'Yes',
        multipleTaxYears: 'No',
        taxYearFrom: '2024-01-01',
        taxYearTo: '2024-12-31',
        functionalCurrency: 'SGD',
        directOwnershipPct: 35,
        commonSharesACB: 1800000,
        acbIncrease: 'No',
        acbDecrease: 'No',
        preferredSharesOwnershipPct: 0,
        preferredSharesACB: 0,
        prefAcbIncrease: 'No',
        prefAcbDecrease: 'No',
        isIndirect: false,
        equityPctBeginning: 35,
        equityPctEnd: 35,
        debtOwedToFA: 0,
        debtOwedToFAOnT106: 'No',
        debtOwedFromFA: 0,
        debtOwedFromFAOnT106: 'No',
        trackingInterest: 'No',
        cfaBecauseSS95_11: 'No',
        cfaBecauseSS95_12: 'No',
        jointElectionSS91_1_4: 'No',
        faDumping_212_3_2_applied: 'No',
        faDumping_75pctFMV: 'No',
        faDumping_businessActivities: 'No',
        faDumping_corpReorg: 'No',
        faDumping_filedInfo: 'No',
        faDumping_deemedDividend: 'No',
        faDumping_PUCIncrease: 'No',
        faDumping_preferredShares212_3_19: 'No',
        financialStatementsAvailable: 'No',
        financialStatementsIncluded: 'No',
        hasAtLeast20pctVoting: 'No',
        dividendReceived: 'No',
        exemptSurplusDividend: 0,
        hybridSurplusDividend: 0,
        taxableSurplusDividend: 0,
        preAcquisitionSurplusDividend: 0,
        reg5900_2Election: 'No',
        reg5901_1_1Election: 'No',
        reg5901_2bElection: 'No',
        qrocElection: 'No',
        totalDividendsCash: 0,
        totalDividendsStock: 0,
        dividendCurrency: 'SGD',
        ss93_1_11Transaction: 'No',
        upstreamLoan_4_1: 'No',
        upstreamLoan_4_2: 'No',
        upstreamLoan_4_3: 'No',
        upstreamLoan_4_4: 'No',
        upstreamLoan_deduction90_9: 'No',
        upstreamLoan_90_8_1: 'No',
        upstreamLoan_90_12: 'No',
        ss88_3Liquidation: 'No',
        ss88_3_1Election: 'No',
        ss51Exchange: 'No',
        shareAcquisitionDisposition: 'No',
        ss91_1_2Applicable: 'No',
        ss95_2cApplicable: 'No',
        surplusEntitlementPctChange: 'No',
        equityPctFAChange: 'No',
        disposedExcludedProperty: 'No',
        disposedNonExcludedCapProp: 'No',
        otherReorgAffectingSurplus: 'No',
        employeeCount: '0',
        reliesOnSubcontractors: 'No',
        revInterestNonArmLength: 0,
        revInterestArmLength: 0,
        revDividendsNonArmLength: 0,
        revDividendsArmLength: 0,
        revRoyaltiesNonArmLength: 0,
        revRoyaltiesArmLength: 0,
        revRentalNonArmLength: 0,
        revRentalArmLength: 0,
        revLoansNonArmLength: 0,
        revLoansArmLength: 0,
        revInsuranceNonArmLength: 0,
        revInsuranceArmLength: 0,
        revFactoringNonArmLength: 0,
        revFactoringArmLength: 0,
        revDispositionsNonArmLength: 0,
        revDispositionsArmLength: 0,
        revCurrencyCode: 'SGD',
        fapiEarned: 'No',
        faplIncurred: 'No',
        faclIncurred: 'No',
        participatingPct: 35,
        fapiAmount: 0,
        faplAmount: 0,
        faclAmount: 0,
        fapi_a_property: 0,
        fapi_b_sale: 0,
        fapi_c_insurance: 0,
        fapi_d_indebtedness_a3: 0,
        fapi_e_indebtedness_a4: 0,
        fapi_f_services: 0,
        fapi_g_property_l: 0,
        fapi_h1_shares: 0,
        fapi_h2_other: 0,
        fapi_i_descC: 0,
        ss95_2_44Election: 'No',
        propertyIncomeInABI: 'No',
        abi_ss95_2a: 'No',
        abi_investmentBusiness: 'No',
        abi_ss95_2l: 'No',
        otherIncomeInABI: 'No',
        abi_90pctTest: 'No',
        abi_ss95_2_3: 'No',
        abi_ss95_2_4: 'No',
        abi_ss95_3: 'No',
        abi_ss95_3_01: 'No',
        infoNotAvailable: 'No',
        infoNotAvailableDetails: '',
        completionPct: 30,
        flags: [
            'First-time filing — full review required',
            'Financial statements not available'
        ],
        linkedToFapi: false
    }
];
const COUNTRY_GROUPS = [
    {
        country: 'France',
        flag: '🇫🇷',
        ids: [
            'fa-fr-01',
            'fa-fr-02',
            'fa-fr-03',
            'fa-fr-04'
        ]
    },
    {
        country: 'Germany',
        flag: '🇩🇪',
        ids: [
            'fa-de-01',
            'fa-de-02',
            'fa-de-03',
            'fa-de-04'
        ]
    },
    {
        country: 'United Kingdom',
        flag: '🇬🇧',
        ids: [
            'fa-gb-01',
            'fa-gb-02',
            'fa-gb-03',
            'fa-gb-04'
        ]
    },
    {
        country: 'United States',
        flag: '🇺🇸',
        ids: [
            'fa-us-01',
            'fa-us-02',
            'fa-us-03',
            'fa-us-04'
        ]
    },
    {
        country: 'Singapore',
        flag: '🇸🇬',
        ids: [
            'fa-sg-01',
            'fa-sg-02',
            'fa-sg-03',
            'fa-sg-04'
        ]
    }
];
const PART_I_SUMMARY = {
    reportingEntityName: 'Northstar Inc.',
    businessNumber: '123456789',
    taxationYearFrom: '2024-01-01',
    taxationYearTo: '2024-12-31',
    naicsCode: '523110',
    numberOfSupplements: 20,
    address: '100 King Street West, Suite 5400, Toronto, ON M5X 1C7',
    contactName: 'Sarah Thompson',
    contactTitle: 'VP Tax',
    contactPhone: '416-555-0100',
    signingOfficerName: 'James Northstar',
    signingOfficerTitle: 'CFO',
    signingDate: '',
    isGroupFiling: false,
    relatedGroupMembers: [],
    ss85Transfer: 'No',
    ss87Amalgamation: 'No',
    ss88WindUp: 'No',
    orgChartUploaded: false,
    dormantAffiliates: [],
    lowerTierNCFAs: []
};
const SOPHIA_IRL_QUESTIONS = [
    {
        category: 'Ownership & Structure',
        questions: [
            {
                id: 'irl-01',
                fa: 'all',
                text: 'Has Northstar\'s direct ownership percentage in any foreign affiliate changed since December 31, 2023?',
                priority: 'high'
            },
            {
                id: 'irl-02',
                fa: 'all',
                text: 'Were any shares of a foreign affiliate acquired or disposed of during the 2024 taxation year?',
                priority: 'high'
            },
            {
                id: 'irl-03',
                fa: 'all',
                text: 'Were any new foreign affiliates incorporated, acquired, or first becoming a foreign affiliate during 2024?',
                priority: 'high'
            },
            {
                id: 'irl-04',
                fa: 'fa-de-01',
                text: 'GmbH Berlin: The ACB of common shares increased in 2024. Please confirm the nature and amount of the capital contribution.',
                priority: 'high'
            }
        ]
    },
    {
        category: 'Loans & Indebtedness',
        questions: [
            {
                id: 'irl-05',
                fa: 'all',
                text: 'Please confirm the balance of any amounts owed by each foreign affiliate to Northstar as at December 31, 2024 (for T106 cross-reference).',
                priority: 'high'
            },
            {
                id: 'irl-06',
                fa: 'fa-us-01',
                text: 'Inc Delaware: An upstream loan arrangement was noted. Please confirm whether ss.90(6) applies and provide the loan balance and terms.',
                priority: 'high'
            },
            {
                id: 'irl-07',
                fa: 'all',
                text: 'Were any new intercompany loans advanced or repaid during 2024?',
                priority: 'medium'
            },
            {
                id: 'irl-08',
                fa: 'all',
                text: 'Were any PLOI elections made under ss.212.3(11) during 2024?',
                priority: 'medium'
            }
        ]
    },
    {
        category: 'Dividends & Surplus',
        questions: [
            {
                id: 'irl-09',
                fa: 'all',
                text: 'Were any dividends paid by any foreign affiliate to Northstar or another foreign affiliate during 2024? If yes, please provide the amount, currency, and payment date.',
                priority: 'high'
            },
            {
                id: 'irl-10',
                fa: 'all',
                text: 'Please confirm the surplus account balances (exempt, hybrid, taxable) for each foreign affiliate as at December 31, 2024.',
                priority: 'high'
            },
            {
                id: 'irl-11',
                fa: 'all',
                text: 'Were any elections made under Reg. 5900(2), Reg. 5901(1.1), or Reg. 5901(2)(b) in respect of any dividend received?',
                priority: 'medium'
            }
        ]
    },
    {
        category: 'Transactions & Reorganizations',
        questions: [
            {
                id: 'irl-12',
                fa: 'all',
                text: 'Was any foreign affiliate involved in an amalgamation, wind-up, liquidation, or other corporate reorganization during 2024?',
                priority: 'high'
            },
            {
                id: 'irl-13',
                fa: 'all',
                text: 'Were any transactions involving the disposition of capital property (excluded or non-excluded) completed by any foreign affiliate in 2024?',
                priority: 'medium'
            },
            {
                id: 'irl-14',
                fa: 'all',
                text: 'Did any foreign affiliate enter into any transactions that may trigger Foreign Affiliate Dumping rules under ss.212.3?',
                priority: 'medium'
            }
        ]
    },
    {
        category: 'Financial Statements',
        questions: [
            {
                id: 'irl-15',
                fa: 'fa-fr-03',
                text: 'SAS Bordeaux: Financial statements are available but not yet included. Please provide unconsolidated financial statements for the year ended December 31, 2024.',
                priority: 'high'
            },
            {
                id: 'irl-16',
                fa: 'fa-de-04',
                text: 'AG Frankfurt: Financial statements are not yet available. Please advise on expected availability date.',
                priority: 'high'
            },
            {
                id: 'irl-17',
                fa: 'fa-sg-04',
                text: 'Pte Singapore IV (first-time filing): Please provide all incorporation documents, share register, and financial statements.',
                priority: 'high'
            },
            {
                id: 'irl-18',
                fa: 'fa-us-04',
                text: 'Corp New York: Financial statements are available but not included. Please provide for review.',
                priority: 'medium'
            },
            {
                id: 'irl-19',
                fa: 'all',
                text: 'Please confirm the functional currency used for each foreign affiliate\'s financial statements for the 2024 taxation year.',
                priority: 'low'
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── T1134 Workpaper ──────────────────────────────────────────────────────────
// Design: Same shell as FapiWorksheet — dark navy top bar, left worksheet area,
// right panel slides in from right, animated InScope logo bottom-center/anchored.
// Part I = single-column summary form for Northstar as reporting entity.
// Part II = frozen-left scrollable grid, 20 FA columns, all CRA sections.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "default",
    ()=>T1134Worksheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenLine$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as PenLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/worksheets/legacy/lib/t1134Data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
;
// ─── Brand colour ─────────────────────────────────────────────────────────────
const PURPLE = 'var(--sx-accent)';
const MILESTONES = [
    {
        id: 'ai-assistant',
        label: 'AI Assistant',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 28,
            columnNumber: 57
        }, ("TURBOPACK compile-time value", void 0)),
        done: false
    },
    {
        id: 'client-context',
        label: 'Client Context',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 29,
            columnNumber: 57
        }, ("TURBOPACK compile-time value", void 0)),
        done: true
    },
    {
        id: 'upload',
        label: 'Upload',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 30,
            columnNumber: 58
        }, ("TURBOPACK compile-time value", void 0)),
        done: true
    },
    {
        id: 'irl',
        label: 'IRL',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 31,
            columnNumber: 58
        }, ("TURBOPACK compile-time value", void 0)),
        done: false
    },
    {
        id: 'validate',
        label: 'Validate',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 32,
            columnNumber: 58
        }, ("TURBOPACK compile-time value", void 0)),
        done: false
    },
    {
        id: 'review',
        label: 'Review',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 33,
            columnNumber: 58
        }, ("TURBOPACK compile-time value", void 0)),
        done: false
    },
    {
        id: 'signoff',
        label: 'Sign-off',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenLine$3e$__["PenLine"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 34,
            columnNumber: 58
        }, ("TURBOPACK compile-time value", void 0)),
        done: false
    },
    {
        id: 'file',
        label: 'File',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 35,
            columnNumber: 58
        }, ("TURBOPACK compile-time value", void 0)),
        done: false
    }
];
// ─── Yes/No Toggle ────────────────────────────────────────────────────────────
function YesNoToggle({ value, onChange, disabled }) {
    if (disabled || !onChange) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px 8px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 700,
                background: value === 'Yes' ? 'rgba(34,197,94,0.15)' : value === 'No' ? 'var(--sx-panel)' : 'rgba(245,158,11,0.15)',
                color: value === 'Yes' ? '#166534' : value === 'No' ? 'var(--sx-muted)' : '#92400e'
            },
            children: value || '—'
        }, void 0, false, {
            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>onChange(value === 'Yes' ? 'No' : 'Yes'),
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1px 8px',
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            background: value === 'Yes' ? 'rgba(34,197,94,0.15)' : value === 'No' ? 'var(--sx-panel)' : 'rgba(245,158,11,0.15)',
            color: value === 'Yes' ? '#166534' : value === 'No' ? 'var(--sx-muted)' : '#92400e',
            border: 'none',
            transition: 'all 0.15s'
        },
        children: value || '—'
    }, void 0, false, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c = YesNoToggle;
// ─── Currency formatter ───────────────────────────────────────────────────────
function fmtCAD(n) {
    if (n === 0) return '—';
    return '$' + n.toLocaleString('en-CA');
}
function fmtPct(n) {
    if (n === 0) return '—';
    return n + '%';
}
// ─── Linked cell ─────────────────────────────────────────────────────────────
function LinkedCell({ value, currency = '' }) {
    if (value === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            color: 'var(--sx-faint)'
        },
        children: "—"
    }, void 0, false, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 80,
        columnNumber: 27
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            color: PURPLE,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontWeight: 600
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                size: 10
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            currency && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 10,
                    opacity: 0.7
                },
                children: currency
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 84,
                columnNumber: 20
            }, this),
            fmtCAD(value)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
_c1 = LinkedCell;
// FlagCell removed — no alert triangles shown in column headers
// ─── Section accordion ───────────────────────────────────────────────────────
function SectionAccordion({ title, subtitle, defaultOpen = false, anchor, children }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOpen);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-anchor": anchor,
        style: {
            borderBottom: '1px solid var(--sx-panel)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setOpen((o)=>!o),
                style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'var(--sx-raised)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 11,
                            fontWeight: 800,
                            color: 'var(--sx-body)',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            flex: 1
                        },
                        children: [
                            title,
                            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 400,
                                    color: 'var(--sx-faint)',
                                    marginLeft: 8,
                                    textTransform: 'none',
                                    letterSpacing: 0
                                },
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 111,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                        size: 14,
                        color: "#9ca3af"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 113,
                        columnNumber: 17
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        size: 14,
                        color: "#9ca3af"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 113,
                        columnNumber: 59
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: children
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 115,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(SectionAccordion, "pG0khZI24VrkSmCZcWM9qqrVMh4=");
_c2 = SectionAccordion;
function GridRow({ label, tooltip, cfaOnly, render, fas }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            borderBottom: '1px solid var(--sx-raised)',
            minHeight: 32
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minWidth: 220,
                    maxWidth: 220,
                    padding: '6px 12px',
                    fontSize: 12,
                    color: 'var(--sx-body)',
                    borderRight: '1px solid var(--sx-hairline)',
                    background: 'var(--sx-card)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    position: 'sticky',
                    left: 0,
                    zIndex: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            flex: 1
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    cfaOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 10,
                            color: 'var(--sx-accent-strong)',
                            fontWeight: 600
                        },
                        children: "CFA"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 138,
                        columnNumber: 21
                    }, this),
                    tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        title: tooltip,
                        style: {
                            cursor: 'help',
                            flexShrink: 0,
                            display: 'inline-flex'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            size: 11,
                            color: "#d1d5db"
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                            lineNumber: 139,
                            columnNumber: 109
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 139,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            fas.map((fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        minWidth: 140,
                        maxWidth: 140,
                        padding: '6px 10px',
                        fontSize: 12,
                        borderRight: '1px solid var(--sx-panel)',
                        display: 'flex',
                        alignItems: 'center',
                        background: cfaOnly && fa.tier === 'NCFA' ? 'var(--sx-raised)' : 'var(--sx-card)',
                        color: cfaOnly && fa.tier === 'NCFA' ? 'var(--sx-faint)' : undefined
                    },
                    children: cfaOnly && fa.tier === 'NCFA' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 10,
                            color: 'var(--sx-faint)'
                        },
                        children: "N/A"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 152,
                        columnNumber: 44
                    }, this) : render(fa)
                }, fa.id, false, {
                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_c3 = GridRow;
// ─── Right Panel Content ──────────────────────────────────────────────────────
function RightPanelContent({ milestone, onClose }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const titles = {
        'ai-assistant': 'AI Assistant',
        'client-context': 'Client Context',
        upload: 'Upload Documents',
        irl: 'Information Request Letter',
        validate: 'Validation Checklist',
        review: 'Review',
        signoff: 'Sign-off',
        file: 'File with CRA'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--sx-hairline)',
                    background: 'var(--sx-card)',
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            flex: 1,
                            fontWeight: 700,
                            fontSize: 13,
                            color: 'var(--sx-ink)'
                        },
                        children: titles[milestone]
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        style: {
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: 'var(--sx-faint)',
                            padding: 4
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: 16
                },
                children: [
                    milestone === 'ai-assistant' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'var(--sx-accent-soft)',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 12,
                                    color: 'var(--sx-body)',
                                    lineHeight: 1.6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            color: PURPLE
                                        },
                                        children: "AI"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this),
                                    " has analysed the 2023 T1134 and identified the following items requiring attention for the 2024 filing:"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            [
                                {
                                    fa: 'GmbH Berlin',
                                    msg: 'ACB of common shares increased. Confirm nature of capital contribution and update Section 1B.'
                                },
                                {
                                    fa: 'Inc Delaware',
                                    msg: 'Upstream loan arrangement under ss.90(6) detected. Confirm loan balance and terms for Section 3A.4.'
                                },
                                {
                                    fa: 'Pte Singapore IV',
                                    msg: 'First-time filing. Full review required — all fields are blank and financial statements are not available.'
                                },
                                {
                                    fa: 'AG Frankfurt',
                                    msg: 'Financial statements not available. IRL has been auto-generated to request them.'
                                },
                                {
                                    fa: 'SAS Paris',
                                    msg: 'FAPI > $0. Confirm FAPIT entry and participating percentage in Section 3 (iii).'
                                }
                            ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: 'var(--sx-card)',
                                        border: '1px solid var(--sx-hairline)',
                                        borderRadius: 8,
                                        padding: 10,
                                        fontSize: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 700,
                                                color: 'var(--sx-ink)',
                                                marginBottom: 4
                                            },
                                            children: item.fa
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 205,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: 'var(--sx-muted)',
                                                lineHeight: 1.5
                                            },
                                            children: item.msg
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 206,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 204,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 8
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    placeholder: "Ask the AI assistant…",
                                    style: {
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: 8,
                                        border: '1px solid var(--sx-hairline)',
                                        fontSize: 12,
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this),
                    milestone === 'client-context' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: 12,
                                    background: 'var(--sx-raised)',
                                    borderRadius: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#1e1b4b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            size: 18,
                                            color: "#fff"
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 225,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 224,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 800,
                                                    fontSize: 14,
                                                    color: 'var(--sx-ink)'
                                                },
                                                children: "Northstar Inc."
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                lineNumber: 228,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 11,
                                                    color: 'var(--sx-muted)'
                                                },
                                                children: "BN: 123456789 · FY Dec 31, 2024"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                lineNumber: 229,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, this),
                            [
                                {
                                    label: 'Filing Deadline',
                                    value: 'October 31, 2025',
                                    status: 'ok'
                                },
                                {
                                    label: 'Total FAs',
                                    value: '20 (16 CFA, 4 NCFA)',
                                    status: 'ok'
                                },
                                {
                                    label: 'Countries',
                                    value: '5 (FR, DE, GB, US, SG)',
                                    status: 'ok'
                                },
                                {
                                    label: 'Total FAPI',
                                    value: '$4,131,000 CAD',
                                    status: 'warn'
                                },
                                {
                                    label: 'Supplements Complete',
                                    value: '12 / 20',
                                    status: 'warn'
                                },
                                {
                                    label: 'Flags Outstanding',
                                    value: '6 items',
                                    status: 'error'
                                }
                            ].map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '8px 0',
                                        borderBottom: '1px solid var(--sx-panel)',
                                        fontSize: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'var(--sx-muted)'
                                            },
                                            children: row.label
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontWeight: 700,
                                                color: row.status === 'error' ? '#ef4444' : row.status === 'warn' ? '#f59e0b' : 'var(--sx-ink)'
                                            },
                                            children: row.value
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this),
                    milestone === 'upload' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    border: '2px dashed var(--sx-hairline)',
                                    borderRadius: 10,
                                    padding: 24,
                                    textAlign: 'center',
                                    background: 'var(--sx-raised)',
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        size: 24,
                                        color: "#d1d5db",
                                        className: "mx-auto mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'var(--sx-body)'
                                        },
                                        children: "Drop files here"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--sx-faint)',
                                            marginTop: 4
                                        },
                                        children: "Prior year T1134, financial statements, org charts"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this),
                            [
                                {
                                    name: 'T1134_2023_Northstar.pdf',
                                    size: '2.4 MB',
                                    status: 'done'
                                },
                                {
                                    name: 'OrgChart_2024.pdf',
                                    size: '1.1 MB',
                                    status: 'done'
                                },
                                {
                                    name: 'FS_SASParis_2024.xlsx',
                                    size: '890 KB',
                                    status: 'pending'
                                }
                            ].map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '8px 10px',
                                        background: 'var(--sx-raised)',
                                        borderRadius: 8,
                                        fontSize: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                            size: 14,
                                            color: "#9ca3af"
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 266,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                flex: 1,
                                                color: 'var(--sx-body)'
                                            },
                                            children: f.name
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 267,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'var(--sx-faint)'
                                            },
                                            children: f.size
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 268,
                                            columnNumber: 17
                                        }, this),
                                        f.status === 'done' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 12,
                                            color: "#9ca3af"
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 269,
                                            columnNumber: 40
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 10,
                                                color: 'var(--sx-faint)',
                                                fontWeight: 700
                                            },
                                            children: "PENDING"
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 269,
                                            columnNumber: 78
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 265,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this),
                    milestone === 'irl' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 12,
                                            color: 'var(--sx-muted)',
                                            flex: 1
                                        },
                                        children: [
                                            "AI generated ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOPHIA_IRL_QUESTIONS"].flatMap((g)=>g.questions).length,
                                            " questions"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            background: 'rgba(245,158,11,0.15)',
                                            color: '#92400e',
                                            padding: '2px 8px',
                                            borderRadius: 9999,
                                            fontWeight: 700
                                        },
                                        children: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOPHIA_IRL_QUESTIONS"].flatMap((g)=>g.questions).filter((q)=>q.priority === 'high').length,
                                            " high priority"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 279,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOPHIA_IRL_QUESTIONS"].map((group, gi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 11,
                                                fontWeight: 800,
                                                color: 'var(--sx-body)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                marginBottom: 6,
                                                marginTop: gi > 0 ? 8 : 0
                                            },
                                            children: group.category
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 285,
                                            columnNumber: 17
                                        }, this),
                                        group.questions.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '8px 10px',
                                                    background: 'var(--sx-card)',
                                                    border: '1px solid var(--sx-hairline)',
                                                    borderRadius: 8,
                                                    marginBottom: 6,
                                                    fontSize: 12,
                                                    borderLeft: `3px solid ${q.priority === 'high' ? '#ef4444' : q.priority === 'medium' ? '#f59e0b' : 'var(--sx-faint)'}`
                                                },
                                                children: [
                                                    q.fa !== 'all' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            color: 'var(--sx-muted)',
                                                            marginBottom: 3
                                                        },
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOREIGN_AFFILIATES"].find((f)=>f.id === q.fa)?.shortName
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: 'var(--sx-body)',
                                                            lineHeight: 1.5
                                                        },
                                                        children: q.text
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, q.id, true, {
                                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                lineNumber: 289,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, gi, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: {
                                    marginTop: 8,
                                    padding: '10px 0',
                                    background: PURPLE,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontWeight: 700,
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    width: '100%'
                                },
                                children: "Send IRL to Client"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this),
                    milestone === 'validate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: 'var(--sx-muted)',
                                    marginBottom: 4
                                },
                                children: "Running validation across all 20 supplements…"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this),
                            [
                                {
                                    label: 'All required fields completed',
                                    status: 'fail',
                                    count: '8 missing'
                                },
                                {
                                    label: 'FAPI > 0 → participating % filled',
                                    status: 'fail',
                                    count: '1 issue'
                                },
                                {
                                    label: 'Dividend received → surplus type specified',
                                    status: 'pass',
                                    count: ''
                                },
                                {
                                    label: 'CFA-only fields blank for NCFAs',
                                    status: 'pass',
                                    count: ''
                                },
                                {
                                    label: 'T106 cross-reference — loans flagged',
                                    status: 'warn',
                                    count: '3 items'
                                },
                                {
                                    label: 'Financial statements included for CFAs',
                                    status: 'fail',
                                    count: '2 missing'
                                },
                                {
                                    label: 'First-time filing — all sections complete',
                                    status: 'fail',
                                    count: '1 incomplete'
                                },
                                {
                                    label: 'Upstream loan rules confirmed',
                                    status: 'warn',
                                    count: '1 item'
                                }
                            ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '8px 10px',
                                        background: 'var(--sx-raised)',
                                        borderRadius: 8,
                                        fontSize: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                background: item.status === 'fail' ? 'rgba(239,68,68,0.15)' : item.status === 'warn' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.14)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 332,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                flex: 1,
                                                color: 'var(--sx-body)'
                                            },
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 333,
                                            columnNumber: 17
                                        }, this),
                                        item.count && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: 'var(--sx-muted)'
                                            },
                                            children: item.count
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 334,
                                            columnNumber: 32
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 327,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this),
                    milestone === 'review' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: 'var(--sx-muted)'
                                },
                                children: "Manager review comments"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this),
                            [
                                {
                                    reviewer: 'M. Chen',
                                    comment: 'Please confirm the FAPI breakdown for GmbH Berlin — the interest vs. indebtedness split needs to be verified against the loan agreement.',
                                    date: 'Jun 3, 2025',
                                    resolved: false
                                },
                                {
                                    reviewer: 'J. Park',
                                    comment: 'SAS Paris dividend — confirm Reg. 5900(2) election was not required given the surplus composition.',
                                    date: 'Jun 4, 2025',
                                    resolved: true
                                }
                            ].map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: 10,
                                        background: c.resolved ? 'rgba(16,185,129,0.14)' : 'var(--sx-card)',
                                        border: `1px solid ${c.resolved ? 'rgba(16,185,129,0.14)' : 'var(--sx-hairline)'}`,
                                        borderRadius: 8,
                                        fontSize: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 4
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: 700,
                                                        color: 'var(--sx-ink)'
                                                    },
                                                    children: c.reviewer
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--sx-faint)',
                                                        fontSize: 11
                                                    },
                                                    children: c.date
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 348,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: 'var(--sx-body)',
                                                lineHeight: 1.5
                                            },
                                            children: c.comment
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 352,
                                            columnNumber: 17
                                        }, this),
                                        c.resolved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 6,
                                                fontSize: 11,
                                                color: '#10b981',
                                                fontWeight: 700
                                            },
                                            children: "✓ Resolved"
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 353,
                                            columnNumber: 32
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 347,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: {
                                    padding: '8px 0',
                                    background: 'var(--sx-panel)',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: 'var(--sx-body)',
                                    cursor: 'pointer',
                                    width: '100%'
                                },
                                children: "+ Add Comment"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 341,
                        columnNumber: 11
                    }, this),
                    milestone === 'signoff' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: 'var(--sx-muted)'
                                },
                                children: "Digital sign-off required before filing"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 364,
                                columnNumber: 13
                            }, this),
                            [
                                {
                                    role: 'Preparer',
                                    name: 'Sarah Thompson',
                                    date: 'Jun 5, 2025',
                                    signed: true
                                },
                                {
                                    role: 'Reviewer',
                                    name: 'Michael Chen',
                                    date: '',
                                    signed: false
                                },
                                {
                                    role: 'Partner',
                                    name: 'James Park',
                                    date: '',
                                    signed: false
                                }
                            ].map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '10px 12px',
                                        background: s.signed ? 'rgba(16,185,129,0.14)' : 'var(--sx-raised)',
                                        borderRadius: 8,
                                        border: `1px solid ${s.signed ? 'rgba(16,185,129,0.14)' : 'var(--sx-hairline)'}`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        color: 'var(--sx-ink)'
                                                    },
                                                    children: s.name
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 11,
                                                        color: 'var(--sx-faint)'
                                                    },
                                                    children: s.role
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this),
                                        s.signed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'right'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 11,
                                                        color: '#10b981',
                                                        fontWeight: 700
                                                    },
                                                    children: "✓ Signed"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 10,
                                                        color: 'var(--sx-faint)'
                                                    },
                                                    children: s.date
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 378,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 376,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: {
                                                padding: '6px 12px',
                                                background: '#374151',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            },
                                            children: "Sign"
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 381,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 363,
                        columnNumber: 11
                    }, this),
                    milestone === 'file' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: 12,
                                    background: 'rgba(245,158,11,0.15)',
                                    borderRadius: 8,
                                    fontSize: 12,
                                    color: '#92400e'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "2 sign-offs pending"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 393,
                                        columnNumber: 15
                                    }, this),
                                    " — complete sign-off before filing."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 392,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: 'var(--sx-body)',
                                    marginBottom: 4
                                },
                                children: "Export Options"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    // Generate iFirm CSV
                                    const headers = [
                                        'FA_Name',
                                        'Country',
                                        'Tier',
                                        'TIN',
                                        'DirectOwnershipPct',
                                        'EquityPctEnd',
                                        'FAPI',
                                        'ExemptSurplusDividend',
                                        'TaxYearFrom',
                                        'TaxYearTo'
                                    ];
                                    const rows = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOREIGN_AFFILIATES"].map((fa)=>[
                                            fa.legalName,
                                            fa.country,
                                            fa.tier,
                                            fa.tin,
                                            fa.directOwnershipPct,
                                            fa.equityPctEnd,
                                            fa.fapiAmount,
                                            fa.exemptSurplusDividend,
                                            fa.taxYearFrom,
                                            fa.taxYearTo
                                        ].join(','));
                                    const csv = [
                                        headers.join(','),
                                        ...rows
                                    ].join('\n');
                                    const blob = new Blob([
                                        csv
                                    ], {
                                        type: 'text/csv'
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'T1134_Northstar_2024_iFirm.csv';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                },
                                style: {
                                    padding: '10px 0',
                                    background: PURPLE,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontWeight: 700,
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 415,
                                        columnNumber: 15
                                    }, this),
                                    " Download iFirm CSV"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 396,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: {
                                    padding: '10px 0',
                                    background: 'var(--sx-panel)',
                                    color: 'var(--sx-faint)',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontWeight: 700,
                                    fontSize: 13,
                                    cursor: 'not-allowed',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 418,
                                        columnNumber: 15
                                    }, this),
                                    " CRA XML Export ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 10
                                        },
                                        children: "(Coming soon)"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 418,
                                        columnNumber: 50
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 417,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 8,
                                    padding: 10,
                                    background: 'var(--sx-raised)',
                                    borderRadius: 8,
                                    fontSize: 11,
                                    color: 'var(--sx-faint)'
                                },
                                children: "CRA submission reference will appear here after filing confirmation."
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 391,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
_c4 = RightPanelContent;
// ─── Part I — Summary Form ────────────────────────────────────────────────────
function PartISummary() {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PART_I_SUMMARY"];
    const fields = [
        {
            label: 'Reporting Entity Name',
            value: s.reportingEntityName
        },
        {
            label: 'Business Number (BN)',
            value: s.businessNumber
        },
        {
            label: 'Taxation Year — From',
            value: s.taxationYearFrom
        },
        {
            label: 'Taxation Year — To',
            value: s.taxationYearTo
        },
        {
            label: 'NAICS Code',
            value: s.naicsCode
        },
        {
            label: 'Number of Supplements',
            value: s.numberOfSupplements
        },
        {
            label: 'Head Office Address',
            value: s.address
        },
        {
            label: 'Contact Name',
            value: s.contactName
        },
        {
            label: 'Contact Title',
            value: s.contactTitle
        },
        {
            label: 'Contact Phone',
            value: s.contactPhone
        },
        {
            label: 'Signing Officer',
            value: s.signingOfficerName
        },
        {
            label: 'Signing Officer Title',
            value: s.signingOfficerTitle
        },
        {
            label: 'Signing Date',
            value: s.signingDate || '—'
        },
        {
            label: 'Group Filing?',
            value: s.isGroupFiling ? 'Yes' : 'No'
        },
        {
            label: 'ss.85 Transfer?',
            value: s.ss85Transfer
        },
        {
            label: 'ss.87 Amalgamation?',
            value: s.ss87Amalgamation
        },
        {
            label: 'ss.88 Wind-up?',
            value: s.ss88WindUp
        },
        {
            label: 'Org Chart Uploaded?',
            value: s.orgChartUploaded ? 'Yes' : 'No'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-anchor": "t1134:part1",
        style: {
            padding: '20px 24px',
            maxWidth: 640
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    fontWeight: 800,
                    color: 'var(--sx-ink)',
                    marginBottom: 4
                },
                children: "Part I — T1134 Summary"
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 456,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 12,
                    color: 'var(--sx-faint)',
                    marginBottom: 20
                },
                children: "Filed once per reporting entity. Applies to Northstar Inc. as the Canadian filer."
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 457,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    border: '1px solid var(--sx-hairline)',
                    borderRadius: 10,
                    overflow: 'hidden'
                },
                children: fields.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 16,
                            padding: '9px 14px',
                            background: i % 2 === 0 ? 'var(--sx-card)' : 'var(--sx-raised)',
                            borderBottom: i < fields.length - 1 ? '1px solid var(--sx-panel)' : 'none'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    minWidth: 200,
                                    fontSize: 12,
                                    color: 'var(--sx-muted)',
                                    paddingTop: 1
                                },
                                children: f.label
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 467,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--sx-ink)'
                                },
                                children: String(f.value)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 468,
                                columnNumber: 13
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 462,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 460,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            fontWeight: 800,
                            color: 'var(--sx-body)',
                            marginBottom: 10
                        },
                        children: "Section 3D — Dormant Foreign Affiliates"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 473,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: 'var(--sx-faint)',
                            padding: '12px 14px',
                            background: 'var(--sx-raised)',
                            borderRadius: 8,
                            border: '1px solid var(--sx-hairline)'
                        },
                        children: "No dormant affiliates reported for 2024."
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 472,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            fontWeight: 800,
                            color: 'var(--sx-body)',
                            marginBottom: 10
                        },
                        children: "Section 3E — Lower-Tier Non-Controlled Foreign Affiliates"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: 'var(--sx-faint)',
                            padding: '12px 14px',
                            background: 'var(--sx-raised)',
                            borderRadius: 8,
                            border: '1px solid var(--sx-hairline)'
                        },
                        children: "No lower-tier NCFAs reported for 2024."
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 480,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 478,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 455,
        columnNumber: 5
    }, this);
}
_c5 = PartISummary;
// ─── Part II — Supplement Grid ────────────────────────────────────────────────
function PartIIGrid() {
    const fas = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOREIGN_AFFILIATES"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            overflowX: 'auto',
            overflowY: 'visible'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: 'var(--sx-card)',
                    borderBottom: '2px solid var(--sx-hairline)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            minWidth: 220,
                            maxWidth: 220,
                            padding: '10px 12px',
                            fontSize: 11,
                            fontWeight: 800,
                            color: 'var(--sx-body)',
                            borderRight: '1px solid var(--sx-hairline)',
                            background: 'var(--sx-card)',
                            position: 'sticky',
                            left: 0,
                            zIndex: 11,
                            letterSpacing: '0.04em'
                        },
                        children: "FIELD"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 497,
                        columnNumber: 9
                    }, this),
                    __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRY_GROUPS"].map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '4px 10px',
                                        background: 'var(--sx-raised)',
                                        borderBottom: '1px solid var(--sx-hairline)',
                                        borderRight: '1px solid var(--sx-hairline)',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: 'var(--sx-muted)',
                                        minWidth: group.ids.length * 140
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: group.flag
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 513,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        group.country
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 508,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex'
                                    },
                                    children: group.ids.map((id)=>{
                                        const fa = fas.find((f)=>f.id === id);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                minWidth: 140,
                                                maxWidth: 140,
                                                padding: '6px 10px',
                                                borderRight: '1px solid var(--sx-panel)',
                                                background: 'var(--sx-card)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 11,
                                                        fontWeight: 800,
                                                        color: 'var(--sx-ink)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    children: fa.shortName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                        marginTop: 2
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 9,
                                                            fontWeight: 600,
                                                            color: 'var(--sx-faint)'
                                                        },
                                                        children: fa.tier
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                        lineNumber: 528,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 527,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 4,
                                                        height: 2,
                                                        background: 'var(--sx-panel)',
                                                        borderRadius: 9999,
                                                        overflow: 'hidden'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            height: '100%',
                                                            width: `${fa.completionPct}%`,
                                                            background: fa.completionPct >= 90 ? 'rgba(16,185,129,0.14)' : fa.completionPct >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                                            borderRadius: 9999
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, id, true, {
                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                            lineNumber: 520,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                    lineNumber: 516,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, group.country, true, {
                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                            lineNumber: 506,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 495,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part II · Section 1 — Foreign Affiliate Information",
                anchor: "t1134:part2-s1",
                defaultOpen: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Legal Name",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: 'var(--sx-body)'
                                },
                                children: fa.legalName
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 546,
                                columnNumber: 61
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 546,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Country of Residence",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    fa.flag,
                                    " ",
                                    fa.countryCode
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 547,
                                columnNumber: 71
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 547,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "TIN",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    fontFamily: 'monospace',
                                    color: 'var(--sx-body)'
                                },
                                children: fa.tin
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 548,
                                columnNumber: 54
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 548,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "NAICS Code(s)",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11
                                },
                                children: fa.naicsCodes.join(', ')
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 549,
                                columnNumber: 64
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 549,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Functional Currency",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700
                                },
                                children: fa.functionalCurrency
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 550,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 550,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Tier (CFA / NCFA)",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    color: 'var(--sx-muted)'
                                },
                                children: fa.tier
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 552,
                                columnNumber: 11
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 551,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "First-Time Filing?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.firstTimeFiling
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 554,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 554,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Multiple Tax Years?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.multipleTaxYears
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 555,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 555,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Tax Year — From",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11
                                },
                                children: fa.taxYearFrom
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 556,
                                columnNumber: 66
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 556,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Tax Year — To",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11
                                },
                                children: fa.taxYearTo
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 557,
                                columnNumber: 64
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 557,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Business Countries",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11
                                },
                                children: fa.businessCountries.join(', ')
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 558,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 558,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Tax Countries",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11
                                },
                                children: fa.taxCountries.join(', ')
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 559,
                                columnNumber: 64
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 559,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 545,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part II · Section 1B — Capital Stock",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Direct Ownership %",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700
                                },
                                children: fmtPct(fa.directOwnershipPct)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 564,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 564,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Common Shares — ACB",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.commonSharesACB)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 565,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 565,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ACB Increased?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.acbIncrease
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 566,
                                columnNumber: 65
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 566,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ACB Decreased?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.acbDecrease
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 567,
                                columnNumber: 65
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 567,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Preferred Shares — Ownership %",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtPct(fa.preferredSharesOwnershipPct)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 568,
                                columnNumber: 81
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 568,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Preferred Shares — ACB",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.preferredSharesACB)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 569,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 569,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Indirect Ownership?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.isIndirect ? 'Yes' : 'No'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 570,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 570,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 563,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part II · Section 1C — Other Information",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Equity % — Beginning of Year",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700
                                },
                                children: fmtPct(fa.equityPctBeginning)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 575,
                                columnNumber: 79
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 575,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Equity % — End of Year",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700
                                },
                                children: fmtPct(fa.equityPctEnd)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 576,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 576,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Debt Owed TO FA (CAD)",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.debtOwedToFA)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 577,
                                columnNumber: 72
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 577,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Debt to FA on T106?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.debtOwedToFAOnT106
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 578,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 578,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Debt Owed FROM FA (CAD)",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.debtOwedFromFA)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 579,
                                columnNumber: 74
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 579,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Debt from FA on T106?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.debtOwedFromFAOnT106
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 580,
                                columnNumber: 72
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 580,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Tracking Interest (ss.95(8))?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.trackingInterest
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 581,
                                columnNumber: 80
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 581,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "CFA via ss.95(11)?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.cfaBecauseSS95_11
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 582,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 582,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "CFA via ss.95(12)?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.cfaBecauseSS95_12
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 583,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 583,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Joint Election ss.91(1.4)?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.jointElectionSS91_1_4
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 584,
                                columnNumber: 77
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 584,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 574,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part II · Section 1D — Foreign Affiliate Dumping (ss.212.3)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.212.3(2) Applied?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_212_3_2_applied
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 589,
                                columnNumber: 71
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 589,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "75% FMV Exception?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_75pctFMV
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 590,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 590,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Business Activities Exception?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_businessActivities
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 591,
                                columnNumber: 81
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 591,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Corporate Reorganization?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_corpReorg
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 592,
                                columnNumber: 76
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 592,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Filed Information Return?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_filedInfo
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 593,
                                columnNumber: 76
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 593,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Deemed Dividend?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_deemedDividend
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 594,
                                columnNumber: 67
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 594,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "PUC Increase?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_PUCIncrease
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 595,
                                columnNumber: 64
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 595,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Preferred Shares ss.212.3(19)?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faDumping_preferredShares212_3_19
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 596,
                                columnNumber: 81
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 596,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 588,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part II · Section 2 — Financial Information",
                anchor: "t1134:part2-s2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Financial Statements Available?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.financialStatementsAvailable
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 601,
                                columnNumber: 82
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 601,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Financial Statements Included?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.financialStatementsIncluded
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 602,
                                columnNumber: 81
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 602,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "≥20% Voting Shares?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.hasAtLeast20pctVoting
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 603,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 603,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 600,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part II · Section 3A — Surplus Accounts & Dividends",
                anchor: "t1134:part2-s3a",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Dividend Received?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.dividendReceived
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 608,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 608,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Exempt Surplus Dividend",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedCell, {
                                value: fa.exemptSurplusDividend,
                                currency: fa.dividendCurrency
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 609,
                                columnNumber: 74
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Hybrid Surplus Dividend",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedCell, {
                                value: fa.hybridSurplusDividend,
                                currency: fa.dividendCurrency
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 610,
                                columnNumber: 74
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 610,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Taxable Surplus Dividend",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedCell, {
                                value: fa.taxableSurplusDividend,
                                currency: fa.dividendCurrency
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 611,
                                columnNumber: 75
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 611,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Pre-Acquisition Surplus Dividend",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedCell, {
                                value: fa.preAcquisitionSurplusDividend,
                                currency: fa.dividendCurrency
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 612,
                                columnNumber: 83
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 612,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Reg. 5900(2) Election?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.reg5900_2Election
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 613,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 613,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Reg. 5901(1.1) Election?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.reg5901_1_1Election
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 614,
                                columnNumber: 75
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 614,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Reg. 5901(2)(b) Election?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.reg5901_2bElection
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 615,
                                columnNumber: 76
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 615,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "QROC Election ss.90(3)?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.qrocElection
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 616,
                                columnNumber: 74
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 616,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Total Dividends — Cash",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.totalDividendsCash)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 617,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 617,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Total Dividends — Stock",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.totalDividendsStock)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 618,
                                columnNumber: 74
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 618,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.93(1.11) / (1.3) Transaction?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.ss93_1_11Transaction
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 619,
                                columnNumber: 83
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 619,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Upstream Loan — 4.1?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.upstreamLoan_4_1
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 620,
                                columnNumber: 71
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 620,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Upstream Loan — 4.2?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.upstreamLoan_4_2
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 621,
                                columnNumber: 71
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 621,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Upstream Loan — 4.3?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.upstreamLoan_4_3
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 622,
                                columnNumber: 71
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 622,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Upstream Loan — 4.4?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.upstreamLoan_4_4
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 623,
                                columnNumber: 71
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 623,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Deduction ss.90(9)?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.upstreamLoan_deduction90_9
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 624,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 624,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.90(8.1) Applied?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.upstreamLoan_90_8_1
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 625,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 625,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.90(12) Applied?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.upstreamLoan_90_12
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 626,
                                columnNumber: 69
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 607,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part II · Section 3B — Surplus & Share Transactions",
                subtitle: "(CFA only)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.88(3) Liquidation?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.ss88_3Liquidation
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 631,
                                columnNumber: 80
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 631,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.88(3.1) Election?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.ss88_3_1Election
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 632,
                                columnNumber: 79
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 632,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.51 Exchange?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.ss51Exchange
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 633,
                                columnNumber: 74
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 633,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Share Acquisition / Disposition?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.shareAcquisitionDisposition
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 634,
                                columnNumber: 91
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 634,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.91(1.2) Applicable?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.ss91_1_2Applicable
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 635,
                                columnNumber: 81
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 635,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.95(2)(c) Applicable?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.ss95_2cApplicable
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 636,
                                columnNumber: 82
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 636,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Surplus Entitlement % Changed?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.surplusEntitlementPctChange
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 637,
                                columnNumber: 89
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 637,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Equity % of FA Changed?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.equityPctFAChange
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 638,
                                columnNumber: 82
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 638,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Disposed Excluded Property?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.disposedExcludedProperty
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 639,
                                columnNumber: 86
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 639,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Disposed Non-Excluded Cap. Prop.?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.disposedNonExcludedCapProp
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 640,
                                columnNumber: 92
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 640,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Other Reorg Affecting Surplus?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.otherReorgAffectingSurplus
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 641,
                                columnNumber: 89
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 630,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part III · Section 1 — Employees",
                subtitle: "(CFA only)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Full-Time Employees",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700
                                },
                                children: fa.employeeCount
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 646,
                                columnNumber: 78
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 646,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Relies on Subcontractors?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.reliesOnSubcontractors
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 647,
                                columnNumber: 84
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 647,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 645,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part III · Section 2 — Revenue Composition",
                subtitle: "(CFA only, thousands)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(i) Interest — Non-Arm's Length",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fa.revInterestNonArmLength > 0 ? fa.revInterestNonArmLength + 'K' : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 652,
                                columnNumber: 90
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 652,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(i) Interest — Arm's Length",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fa.revInterestArmLength > 0 ? fa.revInterestArmLength + 'K' : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 653,
                                columnNumber: 86
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 653,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(ii) Dividends — Non-Arm's Length",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fa.revDividendsNonArmLength > 0 ? fa.revDividendsNonArmLength + 'K' : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 654,
                                columnNumber: 92
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 654,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(iii) Royalties — Non-Arm's Length",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fa.revRoyaltiesNonArmLength > 0 ? fa.revRoyaltiesNonArmLength + 'K' : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 655,
                                columnNumber: 93
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 655,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(iii) Royalties — Arm's Length",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fa.revRoyaltiesArmLength > 0 ? fa.revRoyaltiesArmLength + 'K' : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 656,
                                columnNumber: 89
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 656,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(iv) Rental — Non-Arm's Length",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fa.revRentalNonArmLength > 0 ? fa.revRentalNonArmLength + 'K' : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 657,
                                columnNumber: 89
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 657,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Currency Code",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700
                                },
                                children: fa.revCurrencyCode
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 658,
                                columnNumber: 72
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 658,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 651,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part III · Section 3 — FAPI / FAPL / FACL",
                subtitle: "(CFA only — 🔗 linked to FAPI worksheet)",
                anchor: "t1134:part3-fapi",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "FAPI Earned?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.fapiEarned
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 663,
                                columnNumber: 71
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 663,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "FAPL Incurred?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faplIncurred
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 664,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 664,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "FACL Incurred?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.faclIncurred
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 665,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 665,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Participating %",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700
                                },
                                children: fmtPct(fa.participatingPct)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 666,
                                columnNumber: 74
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 666,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "FAPI Amount (CAD)",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedCell, {
                                value: fa.fapiAmount
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 667,
                                columnNumber: 76
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 667,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "FAPL Amount (CAD)",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedCell, {
                                value: fa.faplAmount
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 668,
                                columnNumber: 76
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 668,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(a) Property Income",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_a_property)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 669,
                                columnNumber: 78
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 669,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(b) Sale of Property",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_b_sale)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 670,
                                columnNumber: 79
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 670,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(c) Insurance / Reinsurance",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_c_insurance)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 671,
                                columnNumber: 86
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 671,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(d) Indebtedness ss.95(2)(a.3)",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_d_indebtedness_a3)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 672,
                                columnNumber: 89
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 672,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(e) Indebtedness ss.95(2)(a.4)",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_e_indebtedness_a4)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 673,
                                columnNumber: 89
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 673,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(f) Services ss.95(2)(b)",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_f_services)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 674,
                                columnNumber: 83
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 674,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(g) Property ss.95(2)(l)",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_g_property_l)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 675,
                                columnNumber: 83
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 675,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(h)(1) Disposition — Shares",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_h1_shares)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 676,
                                columnNumber: 86
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 676,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(h)(2) Disposition — Other",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_h2_other)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 677,
                                columnNumber: 85
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "(i) Description C",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: fmtCAD(fa.fapi_i_descC)
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 678,
                                columnNumber: 76
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 678,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "ss.95(2.44) Election?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.ss95_2_44Election
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 679,
                                columnNumber: 80
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 679,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 662,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part III · Section 4 — Active Business Income Inclusions",
                subtitle: "(CFA only)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Property Income in ABI?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.propertyIncomeInABI
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 684,
                                columnNumber: 82
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 684,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— ss.95(2)(a)(i)–(vi)?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_ss95_2a
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 685,
                                columnNumber: 81
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 685,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— Investment Business?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_investmentBusiness
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 686,
                                columnNumber: 81
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 686,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— ss.95(2)(l)?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_ss95_2l
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 687,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 687,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Other Income in ABI?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.otherIncomeInABI
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 688,
                                columnNumber: 79
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 688,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— 90% Test?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_90pctTest
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 689,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 689,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— ss.95(2.3)?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_ss95_2_3
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 690,
                                columnNumber: 72
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 690,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— ss.95(2.4)?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_ss95_2_4
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 691,
                                columnNumber: 72
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 691,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— ss.95(3)?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_ss95_3
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 692,
                                columnNumber: 70
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "— ss.95(3.01)?",
                        cfaOnly: true,
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.abi_ss95_3_01
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 693,
                                columnNumber: 73
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 693,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 683,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionAccordion, {
                title: "Part IV — Disclosure",
                anchor: "t1134:part4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Information Not Available?",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNoToggle, {
                                value: fa.infoNotAvailable
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 698,
                                columnNumber: 77
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 698,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GridRow, {
                        label: "Details",
                        fas: fas,
                        render: (fa)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: 'var(--sx-faint)'
                                },
                                children: fa.infoNotAvailableDetails || '—'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 699,
                                columnNumber: 58
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 699,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 697,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 493,
        columnNumber: 5
    }, this);
}
_c6 = PartIIGrid;
// ─── T1134 Toolbar — portals into GlobalTopNav's nav slot ────────────────────
const NEU_PRESS = 'inset 3px 3px 7px rgba(158,158,178,0.38), inset -3px -3px 7px rgba(255,255,255,0.84)';
function T1134Toolbar({ activePanel, onSelect }) {
    _s1();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "T1134Toolbar.useEffect": ()=>{
            setMounted(true);
        }
    }["T1134Toolbar.useEffect"], []);
    if (!mounted) return null;
    const slot = document.getElementById('global-nav-workflow-slot');
    if (!slot) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 shrink-0",
                style: {
                    fontSize: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--neu-text-muted)'
                        },
                        children: "Northstar Inc."
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 725,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'rgba(0,0,0,0.2)'
                        },
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 726,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--neu-text-muted)'
                        },
                        children: "ICT"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 727,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'rgba(0,0,0,0.2)'
                        },
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 728,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--neu-text-muted)'
                        },
                        children: "Comply"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 729,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'rgba(0,0,0,0.2)'
                        },
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 730,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--neu-text)',
                            fontWeight: 600
                        },
                        children: "T1134"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 731,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 724,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                }
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 735,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 1,
                    height: 16,
                    background: 'rgba(0,0,0,0.10)',
                    flexShrink: 0
                }
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 738,
                columnNumber: 7
            }, this),
            MILESTONES.map((m)=>{
                const isActive = activePanel === m.id;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>onSelect(m.id),
                    className: "neu-action inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-all shrink-0",
                    style: {
                        height: 32,
                        paddingInline: 10,
                        border: 'none',
                        cursor: 'pointer',
                        background: isActive ? '#d8d8e2' : 'transparent',
                        boxShadow: isActive ? NEU_PRESS : undefined,
                        color: isActive ? PURPLE : 'var(--neu-text)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                flexShrink: 0,
                                opacity: isActive ? 1 : m.done ? 0.85 : 0.4,
                                transition: 'opacity 150ms'
                            },
                            children: m.icon
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                            lineNumber: 758,
                            columnNumber: 13
                        }, this),
                        m.label
                    ]
                }, m.id, true, {
                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                    lineNumber: 744,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 1,
                    height: 16,
                    background: 'rgba(0,0,0,0.10)',
                    flexShrink: 0
                }
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 771,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-0.5",
                        children: MILESTONES.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 14,
                                    height: 3,
                                    borderRadius: 9999,
                                    background: m.done ? 'var(--neu-text)' : 'rgba(0,0,0,0.12)',
                                    opacity: m.done ? 0.55 : 1
                                }
                            }, m.id, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 775,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 773,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 10,
                            color: 'var(--neu-text-muted)',
                            fontWeight: 500
                        },
                        children: [
                            MILESTONES.filter((m)=>m.done).length,
                            "/",
                            MILESTONES.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 782,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 772,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true), slot);
}
_s1(T1134Toolbar, "LrrVfNW3d1raFE0BNzCTILYmIfo=");
_c7 = T1134Toolbar;
function T1134Worksheet() {
    _s2();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('part2');
    const [activePanel, setActivePanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleMilestoneSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "T1134Worksheet.useCallback[handleMilestoneSelect]": (id)=>{
            setActivePanel({
                "T1134Worksheet.useCallback[handleMilestoneSelect]": (prev)=>prev === id ? null : id
            }["T1134Worksheet.useCallback[handleMilestoneSelect]"]);
        }
    }["T1134Worksheet.useCallback[handleMilestoneSelect]"], []);
    const handleClosePanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "T1134Worksheet.useCallback[handleClosePanel]": ()=>{
            setActivePanel(null);
        }
    }["T1134Worksheet.useCallback[handleClosePanel]"], []);
    const panelOpen = activePanel !== null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen bg-gray-50 dark:bg-white/5 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T1134Toolbar, {
                activePanel: activePanel,
                onSelect: handleMilestoneSelect
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 809,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pt-3 pb-1 bg-white dark:bg-[#1c1c24]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[10px] font-700 text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5",
                        children: "T1134 WORKPAPER"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 813,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-base font-600 text-gray-900 dark:text-gray-100 leading-tight",
                        children: "Information Return Relating to Controlled and Non-Controlled Foreign Affiliates"
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 814,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 812,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-4 py-2 bg-white dark:bg-[#1c1c24] border-b border-gray-100 dark:border-white/10 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]",
                                children: "Company"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 820,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]",
                                children: "Northstar Inc."
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 821,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 819,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]",
                                children: "Filing Year"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 824,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]",
                                children: "2024"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 825,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 823,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]",
                                children: "Tax Year End"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 828,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]",
                                children: "Dec 31, 2024"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 829,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 827,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]",
                                children: "Due"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 832,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]",
                                children: "Oct 31, 2025"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 833,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 831,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]",
                                children: "Affiliates"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 836,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]",
                                children: "20"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 837,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 835,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-auto flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 842,
                                        columnNumber: 13
                                    }, this),
                                    " 4 complete",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 843,
                                        columnNumber: 13
                                    }, this),
                                    " 12 in progress",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-red-400 inline-block"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 844,
                                        columnNumber: 13
                                    }, this),
                                    " 4 not started"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 841,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleMilestoneSelect('file'),
                                className: "flex items-center gap-1 text-[11px] font-500 px-2.5 py-1 rounded border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all",
                                style: {
                                    cursor: 'pointer',
                                    background: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 852,
                                        columnNumber: 13
                                    }, this),
                                    " iFirm CSV"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 847,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('client'),
                                className: "flex items-center gap-1 text-[11px] font-500 px-2.5 py-1 rounded border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all",
                                style: {
                                    cursor: 'pointer',
                                    background: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 860,
                                        columnNumber: 13
                                    }, this),
                                    " Share with Client"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 855,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 839,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 818,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-0 bg-white dark:bg-[#1c1c24] border-b border-gray-100 dark:border-white/10 px-4 shrink-0",
                children: [
                    {
                        id: 'part1',
                        label: 'Part I — Summary'
                    },
                    {
                        id: 'part2',
                        label: 'Part II — Supplement (20 FAs)'
                    },
                    {
                        id: 'client',
                        label: 'Client Portal View'
                    }
                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab.id),
                        className: "px-4 py-2.5 text-xs border-none bg-none cursor-pointer transition-colors",
                        style: {
                            background: 'none',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            color: activeTab === tab.id ? 'var(--sx-body)' : 'var(--sx-faint)',
                            borderBottom: activeTab === tab.id ? '1.5px solid var(--sx-body)' : '1.5px solid transparent',
                            marginBottom: -1
                        },
                        children: tab.label
                    }, tab.id, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 872,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 866,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'flex',
                    overflow: 'hidden',
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflowY: 'auto',
                            overflowX: activeTab === 'part2' ? 'auto' : 'hidden',
                            transition: 'flex-basis 0.3s ease-out',
                            paddingBottom: 24
                        },
                        children: [
                            activeTab === 'part1' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PartISummary, {}, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 897,
                                columnNumber: 37
                            }, this),
                            activeTab === 'part2' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PartIIGrid, {}, void 0, false, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 898,
                                columnNumber: 37
                            }, this),
                            activeTab === 'client' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: 32,
                                    maxWidth: 600
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 20,
                                            fontWeight: 800,
                                            color: 'var(--sx-ink)',
                                            marginBottom: 8
                                        },
                                        children: "Client Portal View"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 901,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 13,
                                            color: 'var(--sx-muted)',
                                            lineHeight: 1.7,
                                            marginBottom: 20
                                        },
                                        children: "This view shows the T1134 workpaper as Northstar Inc.'s tax team would see it — with calculated fields locked and only confirmation questions editable. Share a secure link with the client to allow them to confirm ownership percentages, loan balances, and transaction details directly."
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 902,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: 16,
                                            background: 'var(--sx-accent-soft)',
                                            border: '1px solid var(--sx-accent-soft)',
                                            borderRadius: 10,
                                            fontSize: 12,
                                            color: 'var(--sx-body)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 800,
                                                    color: PURPLE,
                                                    marginBottom: 8
                                                },
                                                children: "🔗 Shareable Link"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                lineNumber: 906,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: 'monospace',
                                                    background: 'var(--sx-card)',
                                                    padding: '6px 10px',
                                                    borderRadius: 6,
                                                    color: 'var(--sx-body)',
                                                    marginBottom: 10
                                                },
                                                children: "https://inscope.sinaxe.com/client/northstar/t1134/2024?token=abc123"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                lineNumber: 907,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    padding: '8px 16px',
                                                    background: PURPLE,
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 6,
                                                    fontWeight: 700,
                                                    fontSize: 12,
                                                    cursor: 'pointer'
                                                },
                                                children: "Generate Client Link"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                lineNumber: 910,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 905,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 20
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color: 'var(--sx-body)',
                                                    marginBottom: 10
                                                },
                                                children: "Questions awaiting client confirmation"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                lineNumber: 915,
                                                columnNumber: 17
                                            }, this),
                                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$legacy$2f$lib$2f$t1134Data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOPHIA_IRL_QUESTIONS"].flatMap((g)=>g.questions).filter((q)=>q.priority === 'high').slice(0, 5).map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: '10px 12px',
                                                        background: 'var(--sx-card)',
                                                        border: '1px solid var(--sx-hairline)',
                                                        borderRadius: 8,
                                                        marginBottom: 8,
                                                        fontSize: 12
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                color: 'var(--sx-body)',
                                                                lineHeight: 1.5
                                                            },
                                                            children: q.text
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                            lineNumber: 918,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                gap: 8,
                                                                marginTop: 8
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    style: {
                                                                        padding: '4px 12px',
                                                                        background: 'rgba(34,197,94,0.15)',
                                                                        color: '#166534',
                                                                        border: 'none',
                                                                        borderRadius: 6,
                                                                        fontWeight: 700,
                                                                        fontSize: 11,
                                                                        cursor: 'pointer'
                                                                    },
                                                                    children: "Confirmed"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                                    lineNumber: 920,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    style: {
                                                                        padding: '4px 12px',
                                                                        background: 'rgba(239,68,68,0.15)',
                                                                        color: '#991b1b',
                                                                        border: 'none',
                                                                        borderRadius: 6,
                                                                        fontWeight: 700,
                                                                        fontSize: 11,
                                                                        cursor: 'pointer'
                                                                    },
                                                                    children: "Change needed"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                                    lineNumber: 921,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                            lineNumber: 919,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, q.id, true, {
                                                    fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                                    lineNumber: 917,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                        lineNumber: 914,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                                lineNumber: 900,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 892,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '38%',
                            background: 'var(--sx-card)',
                            borderLeft: '1px solid var(--sx-hairline)',
                            boxShadow: panelOpen ? '-4px 0 24px rgba(0,0,0,0.08)' : 'none',
                            transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
                            transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
                            zIndex: 30,
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        children: activePanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RightPanelContent, {
                            milestone: activePanel,
                            onClose: handleClosePanel
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                            lineNumber: 939,
                            columnNumber: 27
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                        lineNumber: 931,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
                lineNumber: 890,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx",
        lineNumber: 807,
        columnNumber: 5
    }, this);
}
_s2(T1134Worksheet, "bODYuwrcB277MeCz0CXZg79eSTk=");
_c8 = T1134Worksheet;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "YesNoToggle");
__turbopack_context__.k.register(_c1, "LinkedCell");
__turbopack_context__.k.register(_c2, "SectionAccordion");
__turbopack_context__.k.register(_c3, "GridRow");
__turbopack_context__.k.register(_c4, "RightPanelContent");
__turbopack_context__.k.register(_c5, "PartISummary");
__turbopack_context__.k.register(_c6, "PartIIGrid");
__turbopack_context__.k.register(_c7, "T1134Toolbar");
__turbopack_context__.k.register(_c8, "T1134Worksheet");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_worksheets_legacy_721f5f67._.js.map