import { aquachainContent } from './content';

const homeTitle = 'AquaChain | Water management on Cosmos';
const homeDescription = aquachainContent.description;

function moduleSeo(moduleId: string) {
  const mod = aquachainContent.modules.find((entry) => entry.id === moduleId);
  if (!mod) {
    return { title: homeTitle, description: homeDescription };
  }
  return {
    title: `${mod.name} | AquaChain`,
    description: mod.blurb,
  };
}

export const aquachainHomeSeo = {
  title: homeTitle,
  description: homeDescription,
};

export const aquachainRouteSeo: Record<string, { title: string; description: string }> = {
  '': aquachainHomeSeo,
  'agent-ops': {
    title: `${aquachainContent.agentOps.title} | AquaChain`,
    description: aquachainContent.modules.find((m) => m.id === 'agent-ops')?.blurb ?? homeDescription,
  },
  contact: {
    title: `${aquachainContent.contact.title} | AquaChain`,
    description: aquachainContent.contact.lead,
  },
  'citizen-science': moduleSeo('citizen-science'),
  'water-well-initiative': moduleSeo('water-well'),
  'water-utilities': moduleSeo('utilities'),
  'sustainable-actions': moduleSeo('sustainable-actions'),
  'community-bounty': moduleSeo('community-bounty'),
  'water-credits': moduleSeo('water-credits'),
  'local-dao': moduleSeo('local-dao'),
  'cross-exchange': moduleSeo('cross-exchange'),
};
