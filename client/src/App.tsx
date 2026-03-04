import { useState } from 'react'
import { CsvUpload, WorkoutRecord } from './components/CsvUpload'
import { WorkoutDataDisplay } from './components/WorkoutDataDisplay'
import './App.css'

function App() {
  const [workoutData, setWorkoutData] = useState<WorkoutRecord[]>([])

  const handleDataLoaded = (data: WorkoutRecord[]) => {
    setWorkoutData(data)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💪 Gym Training Tracker</h1>
        <p>Upload your Hevy workout data to get started</p>
      </header>

      <main className="app-main">
        <CsvUpload onDataLoaded={handleDataLoaded} />
        {workoutData.length > 0 && <WorkoutDataDisplay data={workoutData} />}
      </main>
    </div>
  )
}

export default App
