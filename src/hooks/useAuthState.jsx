import React from 'react'
import { AuthContext } from '@providers'
import { ROLE } from '@utils'

function useAuthState() {
  const state = React.useContext(AuthContext)
  const isPending = state.status === 'pending'
  const isError = state.status === 'error'
  const isSuccess = state.status === 'success'
  const isAuthenticated = state.user && isSuccess
  const isManager = isAuthenticated && state.user.role === ROLE.MANAGER

  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    isAuthenticated,
    isManager,
  }
}

export default useAuthState
