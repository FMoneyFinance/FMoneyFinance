import { Axios } from '..'
import { encryptPayload } from '../../utils/encrypt'
import { payloads_users_management } from './dtos'

export const user_authentication_api = async (payload: object) => {
  const response = await Axios.post(import.meta.env.VITE_URL_USERS_MNG_API + 'user-authentication', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const user_raffles_history_api = async (payload: object) => {
  const response = await Axios.post(import.meta.env.VITE_URL_USERS_MNG_API + 'user-raffles-history', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const user_raffle_position_slots_api = async (payload: payloads_users_management['user_raffle_position_slots']) => {
  const response = await Axios.post(import.meta.env.VITE_URL_USERS_MNG_API + 'user-raffle-position-slots', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const allowed_tokens_api = async () => {
  const response = await Axios.get(import.meta.env.VITE_URL_USERS_MNG_API + 'allowed-tokens', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  return response
}

export const current_manager_smart_contract = async () => {
  const response = await Axios.get(import.meta.env.VITE_URL_USERS_MNG_API + 'current-manager-smart-contract', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  return response
}

export const get_graphs_references_info = async (raffleSmartContractAddress: any) => {
  const response = await Axios.get(import.meta.env.VITE_URL_USERS_MNG_API + 'graph-references-info/' + raffleSmartContractAddress, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  return response
}
