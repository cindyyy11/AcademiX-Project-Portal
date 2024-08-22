// import C from '../models/CaseStudy';
// import Proposal from '../models/Proposal';
// import FinalDoc from '../models/FinalDoc';
// import Grade from '../models/Grade';

import CaseStudyModel from "../models/caseStudy.model";
import FinalDocumentationModel from "../models/finalDocumentation.model";
import GradeModel from "../models/grade.model";
import ProposalModel from "../models/proposal.model";

interface CaseStudyType {
  updatedAt: string;
}

interface ProposalDetailsType {
  updatedAt: string;
}

interface ProposalType {
  proposalDetails: ProposalDetailsType;
}

interface FinalDocDetailsType {
  updatedAt: string;
}

interface FinalDocType {
  finalDocDetails: FinalDocDetailsType;
}

interface GradeType {
  updatedAt: string;
}

interface StatusData {
  caseStudies: CaseStudyType[];
  proposals: ProposalDetailsType[];
  finalDocs: FinalDocDetailsType[];
  grades: GradeType[];
}

async function retrieveStatusData(): Promise<StatusData> {
  try {
    const caseStudies = await CaseStudyModel.find({});
    const proposals = await ProposalModel.find({});
    const finalDocs = await FinalDocumentationModel.find({});
    const grades = await GradeModel.find({});

    const statusData: StatusData = {
      caseStudies: caseStudies.map((cs: CaseStudyType) => ({ updatedAt: cs.updatedAt })),
      proposals: proposals.map((p: ProposalType) => ({ updatedAt: p.proposalDetails.updatedAt })),
      finalDocs: finalDocs.map((fd: FinalDocType) => ({ updatedAt: fd.finalDocDetails.updatedAt })),
      grades: grades.map((g: GradeType) => ({ updatedAt: g.updatedAt })),
    };

    return statusData;
  } catch (error) {
    throw new Error('Error retrieving status data: ' + (error as Error).message);
  }
}

export { retrieveStatusData };
