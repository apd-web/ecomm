import { healthRepository } from "../repositories/healthRepository";

export const healthService = {
  getHealth: () => {
    return {
      ...healthRepository.getStatus(),
      timestamp: new Date().toISOString(),
    };
  },
};
