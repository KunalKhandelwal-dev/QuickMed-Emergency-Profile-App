// Utility functions for localStorage management and blockchain simulation

export interface EmergencyProfile {
  id: string;
  fullName: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  blockchainHash: string;
  createdAt: string;
}

export interface AccessLog {
  id: string;
  profileId: string;
  scanTime: string;
  responderId: string;
  verificationStatus: string;
}

// Generate a unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate a simulated blockchain hash
export const generateBlockchainHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 16; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Save emergency profile
export const saveProfile = (profile: Omit<EmergencyProfile, 'id' | 'blockchainHash' | 'createdAt'>): EmergencyProfile => {
  const id = generateId();
  const blockchainHash = generateBlockchainHash();
  const createdAt = new Date().toISOString();
  
  const fullProfile: EmergencyProfile = {
    ...profile,
    id,
    blockchainHash,
    createdAt,
  };
  
  localStorage.setItem(`profile_${id}`, JSON.stringify(fullProfile));
  
  // Save to profiles list
  const profilesList = getProfilesList();
  profilesList.push(id);
  localStorage.setItem('profiles_list', JSON.stringify(profilesList));
  
  return fullProfile;
};

// Get profile by ID
export const getProfile = (id: string): EmergencyProfile | null => {
  const data = localStorage.getItem(`profile_${id}`);
  return data ? JSON.parse(data) : null;
};

// Get all profiles list
export const getProfilesList = (): string[] => {
  const data = localStorage.getItem('profiles_list');
  return data ? JSON.parse(data) : [];
};

// Add access log
export const addAccessLog = (profileId: string): AccessLog => {
  const log: AccessLog = {
    id: generateId(),
    profileId,
    scanTime: new Date().toISOString(),
    responderId: `MEDIC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    verificationStatus: 'Valid',
  };
  
  const logs = getAccessLogs(profileId);
  logs.push(log);
  localStorage.setItem(`logs_${profileId}`, JSON.stringify(logs));
  
  return log;
};

// Get access logs for a profile
export const getAccessLogs = (profileId: string): AccessLog[] => {
  const data = localStorage.getItem(`logs_${profileId}`);
  return data ? JSON.parse(data) : [];
};

// Create demo profile
export const createDemoProfile = (): EmergencyProfile => {
  const demoId = 'demo-profile';
  const existingDemo = getProfile(demoId);
  
  if (existingDemo) {
    return existingDemo;
  }
  
  const demoProfile: EmergencyProfile = {
    id: demoId,
    fullName: 'John Doe',
    bloodGroup: 'O+',
    allergies: 'Penicillin, Peanuts',
    medicalConditions: 'Type 2 Diabetes, Hypertension',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1 (555) 123-4567',
    blockchainHash: '0x83f92a7d91ac0baf',
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(`profile_${demoId}`, JSON.stringify(demoProfile));
  
  // Add some demo logs
  const demoLogs: AccessLog[] = [
    {
      id: generateId(),
      profileId: demoId,
      scanTime: new Date(Date.now() - 86400000).toISOString(),
      responderId: 'MEDIC-0421',
      verificationStatus: 'Valid',
    },
    {
      id: generateId(),
      profileId: demoId,
      scanTime: new Date(Date.now() - 172800000).toISOString(),
      responderId: 'MEDIC-0289',
      verificationStatus: 'Valid',
    },
  ];
  
  localStorage.setItem(`logs_${demoId}`, JSON.stringify(demoLogs));
  
  return demoProfile;
};
