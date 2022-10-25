import { Axios } from '..'

import { encryptPayload } from '../../utils/encrypt'
import { getProvider } from '../../web3/functions/providers'

export const generate_ticket_api = async (payload: object) => {
  const response = await Axios.post(import.meta.env.VITE_URL_TICKETS_MNG_API + 'generate-ticket', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const get_current_raffles_list_api = async () => {
  const response = await Axios.get(import.meta.env.VITE_URL_TICKETS_MNG_API + 'get-current-raffles-list', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  return response
}

export const get_current_raffles_info_hash = async () => {
  const response = await Axios.get(import.meta.env.VITE_URL_TICKETS_MNG_API + 'get-current-raffles-info-hash', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  return response
}

export const get_current_raffles_tickets_info_hash = async (raffleSmartContractAddress: any) => {
  const response = await Axios.get(import.meta.env.VITE_URL_TICKETS_MNG_API + 'get-current-raffles-tickets-info-hash/' + raffleSmartContractAddress, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  return response
}

export const create_raffle_api = async (payload: object) => {
  const response = await Axios.post(
    import.meta.env.VITE_URL_TICKETS_MNG_API + 'create-raffle',
    {
      data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
    },
    {
      headers: { Accept: 'application/json' }
    }
  )

  return response
}

export const has_to_approve_api = async (payload: object, context: any) => {
  payload = {
    ...payload,
    defaultAccount: context.state?.walletAddress,
    userAccountSignature: context.state?.userAccountSignature
  }

  console.log('payload', payload)

  const response = await Axios.post(import.meta.env.VITE_URL_TICKETS_MNG_API + 'has-to-approve', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const generate_links_api = async (payload: object, context: any) => {
  payload = {
    ...payload,
    defaultAccount: context.state?.walletAddress,
    userAccountSignature: context.state?.userAccountSignature
  }

  const response = await Axios.post(
    import.meta.env.VITE_URL_GENERATE_TICKETS_API,
    {
      data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  )

  return response
}

export const send_ticket_to_email_api = async (payload: object, context: any) => {
  payload = {
    ...payload,
    defaultAccount: context.state?.walletAddress,
    userAccountSignature: context.state?.userAccountSignature
  }

  const response = await Axios.post(import.meta.env.VITE_URL_TICKETS_MNG_API + 'send-ticket-to-email', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const download_tickets = async (payload: object, context: any) => {
  payload = {
    ...payload,
    defaultAccount: context.state?.walletAddress,
    userAccountSignature: context.state?.userAccountSignature
  }

  const response = await Axios.post(import.meta.env.VITE_URL_TICKETS_MNG_API + 'create-zip-flie-from-tickets', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const get_current_raffle_manager_smart_contract_address = async (context: any) => {
  const payload = {
    defaultAccount: context.state?.walletAddress,
    userAccountSignature: context.state?.userAccountSignature
  }

  const response = await Axios.post(import.meta.env.VITE_URL_TICKETS_MNG_API + 'get-current-raffle-manager-smart-contract-address', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}

export const update_manager_smart_contract_address = async (payload: object, context: any) => {
  payload = {
    ...payload,
    defaultAccount: context.state?.walletAddress,
    userAccountSignature: context.state?.userAccountSignature
  }

  const response = await Axios.post(import.meta.env.VITE_URL_TICKETS_MNG_API + 'update-manager-smart-contract-address', {
    data: encryptPayload({ ...payload, dataTimestamp: new Date().getTime() })
  })

  return response
}
