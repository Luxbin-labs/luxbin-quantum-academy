import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CourseStore {
  completedLessons: Record<string, string[]>
  completedCourses: string[]
  certificates: Certificate[]

  completeLesson: (courseId: string, lessonId: string) => void
  completeCourse: (courseId: string) => void
  getProgress: (courseId: string) => number
  addCertificate: (cert: Certificate) => void
}

interface Certificate {
  id: string
  courseId: string
  courseName: string
  issuedAt: string
  recipientName: string
  blockchainTxHash?: string
}

const courseLessonCounts: Record<string, number> = {
  'quantum-fundamentals': 8,
  'photonic-computing': 10,
  'entanglement-protocols': 12,
  'quantum-teleportation': 8,
  'nv-centers': 10,
  'quantum-networks': 14,
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      completedCourses: [],
      certificates: [],

      completeLesson: (courseId, lessonId) => {
        set((state) => {
          const courseLessons = state.completedLessons[courseId] || []
          if (courseLessons.includes(lessonId)) return state

          const newLessons = [...courseLessons, lessonId]
          const totalLessons = courseLessonCounts[courseId] || 10

          // Check if course is complete
          let newCompletedCourses = state.completedCourses
          if (newLessons.length >= totalLessons && !state.completedCourses.includes(courseId)) {
            newCompletedCourses = [...state.completedCourses, courseId]
          }

          return {
            completedLessons: {
              ...state.completedLessons,
              [courseId]: newLessons,
            },
            completedCourses: newCompletedCourses,
          }
        })
      },

      completeCourse: (courseId) => {
        set((state) => {
          if (state.completedCourses.includes(courseId)) return state
          return {
            completedCourses: [...state.completedCourses, courseId],
          }
        })
      },

      getProgress: (courseId) => {
        const { completedLessons } = get()
        const completed = completedLessons[courseId]?.length || 0
        const total = courseLessonCounts[courseId] || 10
        return Math.round((completed / total) * 100)
      },

      addCertificate: (cert) => {
        set((state) => ({
          certificates: [...state.certificates, cert],
        }))
      },
    }),
    {
      name: 'luxbin-academy-progress',
    }
  )
)
