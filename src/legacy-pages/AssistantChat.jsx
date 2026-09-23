import ChatAssistant from '../components/ai/ChatAssistant'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

export default function AssistantChat() {
  return (
    <div className="page assistant-page">
      <PageHeader
        title="AI Pet Care Assistant"
        description="Get quick, practical guidance for general pet-care questions and daily routines."
        action={
          <Button to="/" variant="ghost" size="sm">
            Back to dashboard
          </Button>
        }
      />

      <ChatAssistant />
    </div>
  )
}
