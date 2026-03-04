import { useState } from 'react'
import Papa from 'papaparse'
import '../styles/CsvUpload.css'

export interface WorkoutRecord {
  title: string
  start_time: string
  end_time: string
  description: string
  exercise_title: string
  superset_id: string
  exercise_notes: string
  set_index: string
  set_type: string
  weight_kg: string
  reps: string
  distance_km: string
  duration_seconds: string
  rpe: string
  [key: string]: string
}

interface CsvUploadProps {
  onDataLoaded: (data: WorkoutRecord[]) => void
}

export function CsvUpload({ onDataLoaded }: CsvUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as WorkoutRecord[]
          if (data.length === 0) {
            setError('CSV file is empty')
            setLoading(false)
            return
          }
          onDataLoaded(data)
          setLoading(false)
        } catch (err) {
          setError(`Error parsing CSV: ${err instanceof Error ? err.message : 'Unknown error'}`)
          setLoading(false)
        }
      },
      error: (error) => {
        setError(`Error reading file: ${error.message}`)
        setLoading(false)
      }
    })
  }

  return (
    <div className="csv-upload">
      <div className="upload-container">
        <h2>Upload Hevy Workout Data</h2>
        <label htmlFor="csv-input" className="file-label">
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
            className="file-input"
          />
          <span className="file-button">
            {loading ? 'Loading...' : 'Choose CSV File'}
          </span>
        </label>
        <p className="help-text">Select a CSV file exported from the Hevy mobile app</p>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}
