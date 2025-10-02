/* istanbul ignore file */
import { CCSite } from "../state/reducers/requestSlice";
import Site from "./LookupModels";

export const mapSiteToCCSite = (site: any, RequestId:string): CCSite => {
    return {
      CareCoordinationEpisodeId: RequestId,
      CareCoordinationEpisodeDate: '',
      OAOSiteID: site.aprno.toString(),
      NonParSiteID: '',
      OldSiteID: site.aprno.toString(),
      SiteName: site.pname,
      SiteAddr1: site.padD1,
      SiteAddr2: site.padD2,
      SiteCity: site.pcity,
      SiteState: site.pstat,
      SiteZip: site.pazip,
      SitePhone: site.pphon,
      SiteFax: site.pfax,
      SiteSpec1: site.ptype,
      SiteSpec2: site.ptyP2,
      SiteSpecDesc1: site.ptypedesc,
      SiteSpecDesc2: '',
      SiteAlternateID: site.aprno,
      SiteNYMIPar: 'N',
      SteeragePosition: site.ppstrf,
      NPI: site.npi,
      SiteIdent: 0,
      SelectionMethodID: 0,
      Email: '',
      PUSRDF: site.pusrdf,
      SiteIPA: '',
      SiteEntity: site.entity,
      SiteType: site.siteType,
      PhysicianName: site.physicianName
    };
};

