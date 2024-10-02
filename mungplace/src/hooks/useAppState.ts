import {useEffect, useRef, useState} from 'react'
import {AppState, AppStateStatus} from 'react-native'

// 앱이 백그라운드에 들어갔다가 다시 포그라운드로 돌아올 때를 감지하는 커스텀 훅
const useAppState = (): {isComeback: boolean; appStateVisible: AppStateStatus} => {
  // 현재 앱의 상태 참조 ('active', 'background', 'inactive')
  const appState = useRef<AppStateStatus>(AppState.currentState)
  // 앱이 백그라운드에서 포그라운드로 돌아올 때 true로 설정
  const [isComeback, setIsComeback] = useState(false)
  // 현재 앱의 상태 저장 ('active', 'background', 'inactive')
  const [appStateVisible, setAppStateVisible] = useState<AppStateStatus>(appState.current)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // 앱이 백그라운드 또는 비활성화 상태에서 다시 활성화 상태로 전환될 때
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setIsComeback(true)
      }
      // 앱이 활성화 상태에서 백그라운드로 전환될 때
      if (appState.current.match(/active/) && nextAppState === 'background') {
        setIsComeback(false)
      }
      // 앱의 현재 상태 업데이트
      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return {isComeback, appStateVisible}
}

export default useAppState
