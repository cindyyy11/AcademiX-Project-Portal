// import C from '../models/CaseStudy';
// import Proposal from '../models/Proposal';
// import FinalDoc from '../models/FinalDoc';
// import Grade from '../models/Grade';

import CaseStudyModel from "../models/caseStudy.model";
import FinalDocumentationModel from "../models/finalDocumentation.model";
import GradeModel from "../models/grade.model";
import ProposalModel from "../models/proposal.model";

interface StatusEntry {
  updatedAt: Date;
}

interface StatusData {
  caseStudies: StatusEntry[];
  proposals: StatusEntry[];
  finalDocs: StatusEntry[];
  grades: StatusEntry[];
}

async function retrieveStatusData(): Promise<StatusData> {
  try {
    const caseStudies = await CaseStudyModel.find({});
    const proposals = await ProposalModel.find({});
    const finalDocs = await FinalDocumentationModel.find({});
    const grades = await GradeModel.find({});

    const statusData: StatusData = {
      caseStudies: caseStudies.map((cs) => ({ updatedAt: cs.updatedAt })),
      proposals: proposals.map((p) => ({ updatedAt: p.updatedAt })),
      finalDocs: finalDocs.map((fd) => ({ updatedAt: fd.updatedAt })),
      grades: grades.map((g) => ({ updatedAt: g.updatedAt })),
    };

    return statusData;
  } catch (error) {
    throw new Error('Error retrieving status data: ' + (error as Error).message);
  }
}

export { retrieveStatusData };
