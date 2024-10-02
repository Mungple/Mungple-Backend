import {useState} from 'react'

const useModal = (): {isVisible: boolean; show: () => void; hide: () => void} => {
  const [isVisible, setIsVisible] = useState(false)

  const show = () => {
    setIsVisible(true)
  }

  const hide = () => {
    setIsVisible(false)
  }

  return {isVisible, show, hide}
}

export default useModal
