SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME LIKE '%sitec%'

select top 100 * from siteinfo
select top 100 * from tblschsite
select top 100 * from tblschsitedetails

SELECT distinct table_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME LIKE '%program%'
select top 2 * from CCNCompany
select top 2 * from CompanyMgmt
select top 2 * from CompanySubProgram
select top 2 * from CarrierSubProgram
select top 2 * from SubPrograms
select top 2 * from tblProgramType where companyid=8
select top 2 * from CCNPriority
select top 3 * from CCNPriorityCriteria
select top 3 * from CCNPriorityMessages
select top 3 * from CCNPriorityRules
select top 3 * from tblCPTCompany
CompanySubProgram
CarrierSubProgram
SubPrograms
MemberProgramParticipation
SELECT distinct table_name,COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME LIKE '%DiagnosisID%'

select top 100  * from Diagnosis where DiagnosisCode like '%R1%'
select top 1  * from DiagnosisCodeSet
select top 1  * from OrganizationDiagnosisCodeSet
select top 1  * from OrganizationDiagnosisDescription
select top 1  * from ProductDisciplineDiagnoSIS

select top 100  * from Diagnosis where DiagnosisCode like '%R1%'

SELECT distinct table_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME LIKE '%reason%'


select top 100  category from tblpatient 
select top 100 distinct from tblsite 

select top 10 * from AppealCaseReasons where Reason like '%member%'
select top 10 * from CanceledCaseReasons
select top 10 * from JournalReasons
select top 10 * from Reason
select top 10 * from ReasonType


--identify the stored procedures that reference a specific table
SELECT DISTINCT
    o.name AS [Procedure Name],
    o.type_desc AS [Object Type]
FROM
    sys.sql_modules m
    INNER JOIN sys.objects o ON m.object_id = o.object_id
WHERE
    m.definition LIKE '%tblrestrictedmember_hmembp%'
    --AND o.type = 'P'
ORDER BY
    o.name;

--Finding objects containing particular text
  SELECT OBJECT_NAME(id) FROM SYSCOMMENTS  WHERE [text] LIKE '%tblCaseProvider%'  
AND OBJECTPROPERTY(id, 'IsProcedure') = 1  GROUP BY OBJECT_NAME(id)

select distinct * from reason

Check278RulesTable
SELECT Name
FROM sys.procedures
WHERE OBJECT_DEFINITION(OBJECT_ID) LIKE '%INSERT INTO PSMND_RECORDSTATUS %'
select 
   so.name, 
   text 
from 
   sysobjects so, 
   syscomments sc 
where 
   so.id = sc.id 
   and UPPER(text) like '%INSERT INTO PSMND_RECORDSTATUS %'

SELECT TOP 10 * FROM tblau  
SELECT TOP 10 * FROM Export278Main
SELECT TOP 10 * FROM PlanOfCareKeys
select top 100 * from tblHealthplan where 

sp_helptext '[dbo].[ConfigTool_GetHealthPlan]' 

 select  IIF(hpxwalk.IsActive= 1,'Y','N') as AuthorizationLookup,  
  IIF(obrt.IsActive = 1,'Y','N') as EnableOBRTQueue,   
  car.*,  
  ISNULL((select distinct stuff((select ',' + cast(u.CompanyID as varchar(50))  
          from OAODATA.dbo.tblModalityCheckCarrier u (Nolock)  
          where InsCarrier in (car.InsCarrier)  
          for xml path('')),1,1,'') as userlist  
    from OAODATA.dbo.tblModalityCheckCarrier NOLOCK),0) as CompanyID,  
  ISNULL((select distinct stuff((select ',' + cast(u.CompanyID as varchar(50))  
          from OAODATA.dbo.tblModalityCheckCarrier u (Nolock)  
          where InsCarrier in (car.InsCarrier) and ModalityYN='Y'  
          for xml path('')),1,1,'') as userlist  
    from OAODATA.dbo.tblModalityCheckCarrier NOLOCK),-1) as CompanyModalityYN,  
    memap.ImageOneMemberManualEntry,  
    memap.CCNWebMemberManualEntry,  
    memap.ManualMemberEntityIPACheck,  
    memap.UploadClinicalManualMember,  
    memap.PSMNDMemberManualEntry    
 from tblCarrier car with(nolock)  
 left join tblHealthplanCrossWalk hpxwalk (Nolock)  
 On car.InsCarrier = hpxwalk.Healthplan  
  join tblManualEntryMap(nolock) memap  
 on memap.CarrierID=car.CarrierID  
 left join tblOBRTQueue obrt(nolock)  
 on obrt.InsCarrier=car.InsCarrier  
 order by inscarrier  
 select top 10 * from tblCarrier where InsCarrier='HMSA'
 select top 10 * from tblHealthplanCrossWalk where Healthplan='HMSA' -- if it returns 2 then only exceute below delete statement with anyone id in HealthplanCrossWalkId below condition
 delete from tblHealthplanCrossWalk where Healthplan='HMSA' and HealthplanCrossWalkId=142-- give the bigger id in QA/STG environment




