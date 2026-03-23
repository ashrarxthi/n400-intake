import { useState } from 'react'
import CodeEntry from './components/CodeEntry.jsx'
import IntakeForm from './components/IntakeForm.jsx'

export default function App() {
  const [session, setSession] = useState(null)

  if (!session) {
    return <CodeEntry onAuthenticated={setSession} />
  }

  return <IntakeForm session={session} onExit={() => setSession(null)} />
}
