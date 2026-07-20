// Who can donate TO a given recipient blood group (real medical compatibility rules)
const COMPATIBILITY_MAP = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // universal recipient
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"], // O- is universal donor, but can only receive O-
};

export function compatibleDonorGroups(recipientGroup) {
  return COMPATIBILITY_MAP[recipientGroup] || [];
}
