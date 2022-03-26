import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const Images : NextPage = () => {
  const [socket, _] = useState(() => io());
  const [src, setSrc] = useState('')
  const router = useRouter()
  const query = router.query
  useEffect(() => {
    if (router.isReady) {
      const event = 'image_' + query.id
      socket.on(event, (data) => {
        setSrc('data:image/png;base64,' + data.base64)
      })
    }
  }, [router, query])
  return (
    <div><img src={src} width="256" height="256" /></div>
  )
}

export default Images
