export interface SiteSearchResponse extends ResponseBase {
    searchResults: SearchResult[];
}

export interface ResponseBase {
    isSuccess: boolean;
    status: string;
    error: Error;
}

export interface Error {
    message: string | null;
    type: string | null;
}

export interface SearchResult {
    prvno: string;
    pNAME: string;
    pSNAM: string;
    aPRNO: string;
    pADD1: string;
    pADD2: string;
    pCITY: string;
    pSTAT: string;
    pAZIP: string;
    pPHON: string;
    pFAX: string;
    pTYPE: string;
    pTYPEDESC: string;
    pTYP2: string;
    mDPRV: string;
    pSMID: string;
    cONTRACT_EFFECTIVE_DATE: number;
    cONTRACT_TERM_DATE: number;
    fFS_VENDOR: string;
    gROUP_CARRIER: string;
    pLAN_TYPE: string;
    pROVIDER_ATTRIBUTE: string;
    pPSTRF: string;
    pROVIDER_PAR_FLAG: string;
    sortOrder: number;
    geoZip: number;
    selectableYN: string;
    nPI: string;
    tAXID: string;
    entity: string;
    memberIPACode: string;
    pUSRDF: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    nonSiteAlternateID: string;
    pPPSTS: string;
    pCPSTRF: string;
    pCPPLS: string;
    siteNetworkStatus: string;
    assignmentValue: string;
    preferredSort: number;
    siteType: string;
    sortToken: string;
    providerTypeValue: string;
    physicianName: string;
}