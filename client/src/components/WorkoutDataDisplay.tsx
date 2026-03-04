import { useState } from 'react'
import { format, parse, isSameDay } from 'date-fns'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../styles/WorkoutDataDisplay.css'
import { WorkoutRecord } from './CsvUpload'

interface WorkoutDataDisplayProps {
  data: WorkoutRecord[]
}

export function WorkoutDataDisplay({ data }: WorkoutDataDisplayProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set())

  if (data.length === 0) return null

  // Parse dates and group workouts by date
  const workoutsByDate = data.reduce((acc, record) => {
    try {
      // Parse the start_time (format: "3 Mar 2026, 15:16")
      const date = parse(record.start_time, 'd MMM yyyy, HH:mm', new Date())
      const dateKey = format(date, 'yyyy-MM-dd')

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date,
          sessions: []
        }
      }

      // Group by workout session within the date
      const sessionKey = `${record.title}_${record.start_time}`
      let session = acc[dateKey].sessions.find(s => s.key === sessionKey)

      if (!session) {
        session = {
          key: sessionKey,
          title: record.title,
          startTime: record.start_time,
          endTime: record.end_time,
          exercises: []
        }
        acc[dateKey].sessions.push(session)
      }

      session.exercises.push(record)
    } catch (error) {
      console.warn('Failed to parse date:', record.start_time, error)
    }

    return acc
  }, {} as Record<string, { date: Date; sessions: Array<{ key: string; title: string; startTime: string; endTime: string; exercises: WorkoutRecord[] }> }>)

  // Get all dates that have workouts
  const workoutDates = Object.values(workoutsByDate).map(item => item.date)

  // Get workouts for selected date
  const selectedDateWorkouts = selectedDate
    ? workoutsByDate[format(selectedDate, 'yyyy-MM-dd')]?.sessions || []
    : []

  // Custom tile content to highlight workout days
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasWorkout = workoutDates.some(workoutDate => isSameDay(date, workoutDate))
      if (hasWorkout) {
        return <div className="workout-indicator">💪</div>
      }
    }
    return null
  }

  // Handle calendar date selection
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value)
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0])
    } else {
      setSelectedDate(null)
    }
  }

  // Toggle exercise expansion
  const toggleExercise = (exerciseKey: string) => {
    setExpandedExercises(prev => {
      const newSet = new Set(prev)
      if (newSet.has(exerciseKey)) {
        newSet.delete(exerciseKey)
      } else {
        newSet.add(exerciseKey)
      }
      return newSet
    })
  }

  return (
    <div className="workout-data-display">
      <div className="data-summary">
        <h2>Workout Calendar</h2>
        <p>{data.length} records loaded • {workoutDates.length} workout days</p>
      </div>

      <div className="calendar-section">
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
            maxDate={new Date()}
          />
        </div>

        {selectedDate && (
          <div className="selected-date-info">
            <h3>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
            {selectedDateWorkouts.length > 0 ? (
              <p>{selectedDateWorkouts.length} workout session{selectedDateWorkouts.length !== 1 ? 's' : ''}</p>
            ) : (
              <p>No workouts on this day</p>
            )}
          </div>
        )}
      </div>

      {selectedDateWorkouts.length > 0 && (
        <div className="workout-details">
          {selectedDateWorkouts.map((session, sessionIndex) => (
            <div key={sessionIndex} className="workout-session">
              <div className="session-header">
                <h3 className="session-title">{session.title}</h3>
                <div className="session-time">
                  <span className="start-time">{session.startTime}</span>
                  {session.endTime && <span className="end-time"> - {session.endTime}</span>}
                </div>
              </div>

              <div className="exercises-list">
                {Object.entries(
                  session.exercises.reduce((acc, record) => {
                    const exerciseKey = record.exercise_title
                    if (!acc[exerciseKey]) {
                      acc[exerciseKey] = []
                    }
                    acc[exerciseKey].push(record)
                    return acc
                  }, {} as Record<string, WorkoutRecord[]>)
                ).map(([exerciseName, sets]) => {
                  const exerciseId = `${session.key}-${exerciseName}`
                  const isExpanded = expandedExercises.has(exerciseId)

                  return (
                    <div key={exerciseName} className="exercise-item">
                      <div 
                        className="exercise-header"
                        onClick={() => toggleExercise(exerciseId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="exercise-toggle">{isExpanded ? '▼' : '▶'}</span>
                        <h4>{exerciseName}</h4>
                        <span className="sets-count">{sets.length} set{sets.length !== 1 ? 's' : ''}</span>
                      </div>

                      {isExpanded && (
                        <>
                          <div className="sets-list">
                            {sets.map((set, setIndex) => (
                              <div key={setIndex} className="set-item">
                                <span className="set-number">Set {parseInt(set.set_index) + 1}:</span>
                                {set.weight_kg && set.reps ? (
                                  <span className="set-details">
                                    {set.weight_kg} kg × {set.reps} reps
                                  </span>
                                ) : set.distance_km && set.duration_seconds ? (
                                  <span className="set-details">
                                    {set.distance_km} km in {Math.round(parseInt(set.duration_seconds) / 60)} min
                                  </span>
                                ) : set.duration_seconds ? (
                                  <span className="set-details">
                                    {Math.round(parseInt(set.duration_seconds) / 60)} min
                                  </span>
                                ) : (
                                  <span className="set-details">Completed</span>
                                )}
                                {set.rpe && <span className="rpe">RPE: {set.rpe}</span>}
                              </div>
                            ))}
                          </div>

                          {sets[0].exercise_notes && (
                            <div className="exercise-notes">{sets[0].exercise_notes}</div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
