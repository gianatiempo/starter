import { useEffect, useState } from 'react'

const useDocumentTitle = title => {
  const [documentTitle, setDoucmentTitle] = useState(title + ' - Starter')
  useEffect(() => {
    document.title = documentTitle
  }, [documentTitle])

  return [documentTitle, setDoucmentTitle]
}

export default useDocumentTitle
