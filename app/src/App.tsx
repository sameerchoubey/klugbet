import { useState } from 'react'
import { TabNav } from './components/layout/TabNav'
import type { CalculatorMode } from './lib/calculators/types'
import { QualifyingBetPage } from './pages/QualifyingBetPage'
import { FreeBetPage } from './pages/FreeBetPage'
import { JokerBetPage } from './pages/JokerBetPage'

const PAGES: Record<CalculatorMode, () => React.JSX.Element> = {
  qualifying: QualifyingBetPage,
  freeBet: FreeBetPage,
  jokerBet: JokerBetPage,
}

function App() {
  const [activeTab, setActiveTab] = useState<CalculatorMode>('qualifying')
  const ActivePage = PAGES[activeTab]

  return (
    <>
      <TabNav active={activeTab} onChange={setActiveTab} />
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        <ActivePage />
      </div>
    </>
  )
}

export default App
