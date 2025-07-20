import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useAccount } from 'wagmi'
import { RESUME_ZK_CONTRACT_ADDRESS, RESUME_ZK_ABI, CredentialType, type Resume, type Credential } from '@/lib/resumezk-contract'
import { Address } from 'viem'

export function useSubmitResume() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const submitResume = (resumeHash: string, merkleRoot: string) => {
    writeContract({
      address: RESUME_ZK_CONTRACT_ADDRESS,
      abi: RESUME_ZK_ABI,
      functionName: 'submitResume',
      args: [resumeHash as `0x${string}`, merkleRoot as `0x${string}`],
    })
  }

  return {
    submitResume,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useVerifyResume() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const verifyResume = (resumeHash: string) => {
    writeContract({
      address: RESUME_ZK_CONTRACT_ADDRESS,
      abi: RESUME_ZK_ABI,
      functionName: 'verifyResume',
      args: [resumeHash as `0x${string}`],
    })
  }

  return {
    verifyResume,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useGetResume(resumeHash?: string) {
  return useReadContract({
    address: RESUME_ZK_CONTRACT_ADDRESS,
    abi: RESUME_ZK_ABI,
    functionName: 'getResume',
    args: resumeHash ? [resumeHash as `0x${string}`] : undefined,
    query: {
      enabled: !!resumeHash,
    },
  }) as {
    data: Resume | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useGetUserResumes(userAddress?: Address) {
  return useReadContract({
    address: RESUME_ZK_CONTRACT_ADDRESS,
    abi: RESUME_ZK_ABI,
    functionName: 'getUserResumes',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  }) as {
    data: readonly string[] | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useStoreCredential() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const storeCredential = (credType: CredentialType, dataHash: string) => {
    writeContract({
      address: RESUME_ZK_CONTRACT_ADDRESS,
      abi: RESUME_ZK_ABI,
      functionName: 'storeCredential',
      args: [credType, dataHash],
    })
  }

  return {
    storeCredential,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useGetUserCredential(userAddress?: Address, credType?: CredentialType) {
  return useReadContract({
    address: RESUME_ZK_CONTRACT_ADDRESS,
    abi: RESUME_ZK_ABI,
    functionName: 'getUserCredential',
    args: userAddress && credType !== undefined ? [userAddress, credType] : undefined,
    query: {
      enabled: !!userAddress && credType !== undefined,
    },
  }) as {
    data: Credential | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useHasCredential(userAddress?: Address, credType?: CredentialType) {
  return useReadContract({
    address: RESUME_ZK_CONTRACT_ADDRESS,
    abi: RESUME_ZK_ABI,
    functionName: 'hasCredential',
    args: userAddress && credType !== undefined ? [userAddress, credType] : undefined,
    query: {
      enabled: !!userAddress && credType !== undefined,
    },
  }) as {
    data: boolean | undefined
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

export function useResumeZK() {
  const { address } = useAccount()
  
  const submitResume = useSubmitResume()
  const verifyResume = useVerifyResume()
  const storeCredential = useStoreCredential()
  
  const userResumes = useGetUserResumes(address)
  
  return {
    // Write functions
    submitResume,
    verifyResume,
    storeCredential,
    
    // Read functions
    userResumes,
    getResume: useGetResume,
    getUserCredential: useGetUserCredential,
    hasCredential: useHasCredential,
    
    // Utils
    address,
    contractAddress: RESUME_ZK_CONTRACT_ADDRESS,
  }
}