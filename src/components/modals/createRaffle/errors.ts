export const getErrorCreateRaffle = (code: string | number): string => {
  switch (code) {
    case "UNPREDICTABLE_GAS_LIMIT":
      return "Wait some minutes lease to create your raffle";
    case 4001:
      return "User denied transaction signature.";
    default:
      return "";
  }
};
