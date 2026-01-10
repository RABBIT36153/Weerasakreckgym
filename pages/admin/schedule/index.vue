<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">ตารางเรียน</h1>
      <div class="flex gap-4">
        <select
          v-model="selectedView"
          class="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
        >
          <option value="month">รายเดือน</option>
          <option value="week">รายสัปดาห์</option>
          <option value="day">รายวัน</option>
        </select>
        <button @click="today" class="btn-secondary">วันนี้</button>
        <button @click="openAddModal" class="btn-primary">+ เพิ่มคลาส</button>
      </div>
    </div>

    <!-- Calendar Navigation -->
    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <button @click="previousPeriod" class="text-white hover:text-red-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-white">{{ currentPeriodTitle }}</h2>
        <button @click="nextPeriod" class="text-white hover:text-red-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="card">
      <!-- Month View -->
      <div v-if="selectedView === 'month'" class="overflow-x-auto">
        <div class="min-w-full">
          <!-- Week Day Headers -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-center py-3 text-gray-300 font-semibold text-sm"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="(date, index) in calendarDays"
              :key="index"
              class="min-h-[120px] bg-dark-surface border border-dark-border rounded-lg p-2 hover:border-red-primary transition-colors cursor-pointer"
              :class="{
                'bg-dark-bg opacity-50': !date.isCurrentMonth,
                'border-red-primary bg-red-900 bg-opacity-20': date.isToday
              }"
              @click="selectDate(date)"
            >
              <div class="flex justify-between items-center mb-2">
                <span
                  class="text-sm font-semibold"
                  :class="date.isToday ? 'text-red-primary' : date.isCurrentMonth ? 'text-white' : 'text-gray-500'"
                >
                  {{ date.day }}
                </span>
                <span
                  v-if="date.classCount > 0"
                  class="bg-red-primary text-white text-xs px-2 py-0.5 rounded-full"
                >
                  {{ date.classCount }}
                </span>
              </div>
              <div class="space-y-1">
                <div
                  v-for="(classItem, idx) in date.classes"
                  :key="idx"
                  class="text-xs p-1 rounded bg-red-primary text-white truncate cursor-pointer hover:bg-red-600 transition-colors flex items-center justify-between"
                  :title="classItem.title"
                  @click.stop="openRegistrationsModal(classItem)"
                >
                  <span>{{ classItem.time }} {{ classItem.title }}</span>
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-else-if="selectedView === 'week'" class="overflow-x-auto">
        <div class="min-w-full">
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="day in weekDaysData"
              :key="day.date"
              class="border border-dark-border rounded-lg p-4"
              :class="day.isToday ? 'border-red-primary bg-red-900 bg-opacity-20' : 'bg-dark-surface'"
            >
              <div class="text-center mb-4">
                <div class="text-sm text-gray-400">{{ day.dayName }}</div>
                <div
                  class="text-2xl font-bold mt-1"
                  :class="day.isToday ? 'text-red-primary' : 'text-white'"
                >
                  {{ day.day }}
                </div>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(classItem, idx) in day.classes"
                  :key="idx"
                  class="bg-red-primary text-white p-2 rounded text-sm cursor-pointer hover:bg-red-600 transition-colors"
                  @click="openRegistrationsModal(classItem)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="font-semibold">{{ classItem.time }}</div>
                      <div class="text-xs mt-1">{{ classItem.title }}</div>
                    </div>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
                <div v-if="day.classes.length === 0" class="text-gray-500 text-sm text-center py-4">
                  ไม่มีคลาส
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Day View -->
      <div v-else class="border border-dark-border rounded-lg p-6">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-white">
            {{ formatDate(currentDate, 'long') }}
          </h3>
        </div>
        <div class="space-y-3">
          <div
            v-for="hour in dayHours"
            :key="hour"
            class="flex items-start gap-4 border-b border-dark-border pb-3"
          >
            <div class="w-20 text-gray-400 text-sm font-semibold">
              {{ hour }}
            </div>
            <div class="flex-1">
              <div
                v-for="(classItem, idx) in getClassesForHour(hour)"
                :key="idx"
                class="bg-red-primary text-white p-3 rounded-lg mb-2 cursor-pointer hover:bg-red-600 transition-colors"
                @click="openRegistrationsModal(classItem)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-semibold">{{ classItem.title }}</div>
                    <div class="text-sm mt-1">{{ classItem.description }}</div>
                  </div>
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Registrations Modal -->
    <div
      v-if="showRegistrationsModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="closeRegistrationsModal"
    >
      <div class="bg-dark-card rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">
            รายชื่อผู้ลงทะเบียน: {{ selectedCourse?.title || selectedCourse?.name }}
          </h2>
          <button
            @click="closeRegistrationsModal"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="loadingRegistrations" class="text-center py-8">
          <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
        </div>

        <div v-else-if="registrations.length === 0" class="text-center py-8">
          <p class="text-gray-400">ยังไม่มีผู้ลงทะเบียนในคอร์สนี้</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-surface">
              <tr>
                <th class="px-4 py-3 text-left text-gray-300 font-semibold">ชื่อ-นามสกุล</th>
                <th class="px-4 py-3 text-left text-gray-300 font-semibold">อีเมล</th>
                <th class="px-4 py-3 text-left text-gray-300 font-semibold">เบอร์โทร</th>
                <th class="px-4 py-3 text-left text-gray-300 font-semibold min-w-[160px]">สถานะการชำระเงิน</th>
                <th class="px-4 py-3 text-left text-gray-300 font-semibold min-w-[150px]">สถานะ</th>
                <th class="px-4 py-3 text-left text-gray-300 font-semibold">วันที่ลงทะเบียน</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="registration in registrations"
                :key="registration._id || registration.id"
                class="border-b border-dark-border hover:bg-dark-surface transition-colors"
              >
                <td class="px-4 py-3 text-white">{{ registration.userName || '-' }}</td>
                <td class="px-4 py-3 text-gray-300">{{ registration.userEmail }}</td>
                <td class="px-4 py-3 text-gray-300">{{ registration.userPhone }}</td>
                <td class="px-4 py-3 min-w-[160px]">
                  <span
                    :class="{
                      'bg-yellow-500/20 text-yellow-400': registration.paymentStatus === 'pending',
                      'bg-green-500/20 text-green-400': registration.paymentStatus === 'completed',
                      'bg-red-500/20 text-red-400': registration.paymentStatus === 'failed',
                      'bg-gray-500/20 text-gray-400': registration.paymentStatus === 'refunded'
                    }"
                    class="px-3 py-1 rounded-full text-sm whitespace-nowrap"
                  >
                    {{ getPaymentStatusText(registration.paymentStatus) }}
                  </span>
                </td>
                <td class="px-4 py-3 min-w-[150px]">
                  <span
                    :class="{
                      'bg-yellow-500/20 text-yellow-400': registration.status === 'pending',
                      'bg-green-500/20 text-green-400': registration.status === 'confirmed',
                      'bg-blue-500/20 text-blue-400': registration.status === 'completed',
                      'bg-red-500/20 text-red-400': registration.status === 'cancelled'
                    }"
                    class="px-3 py-1 rounded-full text-sm whitespace-nowrap"
                  >
                    {{ getStatusText(registration.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-300">
                  {{ formatRegistrationDate(registration.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end mt-6 pt-6 border-t border-dark-border">
          <button
            @click="closeRegistrationsModal"
            class="btn-secondary"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Class Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-dark-card rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold text-white mb-6">
          {{ modalMode === 'add' ? 'เพิ่มคลาส' : 'แก้ไขคลาส' }}
        </h2>

        <form @submit.prevent="saveClass">
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">ชื่อคลาส *</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>

            <div>
              <label class="block text-gray-300 mb-2">วันที่ *</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">เวลาเริ่ม *</label>
                <input
                  v-model="form.startTime"
                  type="time"
                  required
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>

              <div>
                <label class="block text-gray-300 mb-2">เวลาสิ้นสุด *</label>
                <input
                  v-model="form.endTime"
                  type="time"
                  required
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">ครูมวย</label>
              <select
                v-model="form.trainerId"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              >
                <option value="">เลือกครูมวย</option>
                <option
                  v-for="trainer in trainers"
                  :key="trainer._id || trainer.id"
                  :value="trainer._id || trainer.id"
                >
                  {{ trainer.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">คำอธิบาย</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              ></textarea>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">จำนวนผู้เรียนสูงสุด</label>
              <input
                v-model="form.maxStudents"
                type="number"
                min="1"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-6 mt-6 border-t border-dark-border">
            <button
              type="button"
              @click="closeModal"
              class="btn-secondary"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
            >
              <span v-if="loading">กำลังบันทึก...</span>
              <span v-else>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const API_BASE_URL = 'http://localhost:4002/api'

const selectedView = ref('month')
const currentDate = ref(new Date())
const showModal = ref(false)
const modalMode = ref('add')
const loading = ref(false)
const trainers = ref([])
const courses = ref([])
const showRegistrationsModal = ref(false)
const selectedCourse = ref(null)
const registrations = ref([])
const loadingRegistrations = ref(false)

const weekDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
const weekDaysShort = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

// Classes data - แปลงจาก courses
const classes = computed(() => {
  const result = []
  courses.value.forEach(course => {
    if (course.sessionDates && course.sessionDates.length > 0) {
      course.sessionDates.forEach(dateStr => {
        if (dateStr && dateStr.trim() !== '') {
          result.push({
            id: course._id || course.id,
            courseId: course._id || course.id,
            title: course.name,
            date: dateStr,
            startTime: course.startTime || '09:00',
            endTime: course.endTime || '10:30',
            trainerId: null,
            description: course.description,
            maxStudents: 20
          })
        }
      })
    }
  })
  return result
})

const form = ref({
  id: null,
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  trainerId: '',
  description: '',
  maxStudents: 20
})

// Calendar calculations
const currentPeriodTitle = computed(() => {
  if (selectedView.value === 'month') {
    return formatDate(currentDate.value, 'month')
  } else if (selectedView.value === 'week') {
    const weekStart = getWeekStart(currentDate.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return `${formatDate(weekStart, 'short')} - ${formatDate(weekEnd, 'short')}`
  } else {
    return formatDate(currentDate.value, 'long')
  }
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of month
  const firstDay = new Date(year, month, 1)
  const firstDayWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay() // Convert Sunday (0) to 7
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - (firstDayWeek - 1)) // Start from Monday
  
  // Last day of month
  const lastDay = new Date(year, month + 1, 0)
  const lastDayWeek = lastDay.getDay() === 0 ? 7 : lastDay.getDay()
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (7 - lastDayWeek))
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const dateClasses = classes.value.filter(c => c.date === dateStr)
    const isToday = d.getTime() === today.getTime()
    const isCurrentMonth = d.getMonth() === month
    
    days.push({
      date: dateStr,
      day: d.getDate(),
      isCurrentMonth,
      isToday,
      classes: dateClasses.map(c => ({
        id: c.id,
        courseId: c.courseId,
        title: c.title,
        time: `${c.startTime}-${c.endTime}`,
        description: c.description
      })),
      classCount: dateClasses.length
    })
  }
  
  return days
})

const weekDaysData = computed(() => {
  const weekStart = getWeekStart(currentDate.value)
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const dateClasses = classes.value.filter(c => c.date === dateStr)
    const isToday = date.getTime() === today.getTime()
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      dayName: weekDays[i],
      isToday,
      classes: dateClasses.map(c => ({
        id: c.id,
        courseId: c.courseId,
        title: c.title,
        time: `${c.startTime}-${c.endTime}`,
        description: c.description
      }))
    })
  }
  
  return days
})

const dayHours = computed(() => {
  const hours = []
  for (let i = 6; i < 22; i++) {
    hours.push(`${String(i).padStart(2, '0')}:00`)
  }
  return hours
})

const getClassesForHour = (hour) => {
  const dateStr = currentDate.value.toISOString().split('T')[0]
  return classes.value.filter(c => {
    if (c.date !== dateStr) return false
    const classHour = c.startTime.split(':')[0]
    return classHour === hour.split(':')[0]
  })
}

const formatDate = (date, format = 'short') => {
  const d = new Date(date)
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  
  if (format === 'month') {
    return `${months[d.getMonth()]} ${d.getFullYear() + 543}`
  } else if (format === 'long') {
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`
  } else {
    return `${d.getDate()} ${months[d.getMonth()]}`
  }
}

const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - (day === 0 ? 6 : day - 1) // Get Monday
  return new Date(d.setDate(diff))
}

const previousPeriod = () => {
  if (selectedView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else if (selectedView.value === 'week') {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() - 7)
    currentDate.value = newDate
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() - 1)
    currentDate.value = newDate
  }
}

const nextPeriod = () => {
  if (selectedView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else if (selectedView.value === 'week') {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + 7)
    currentDate.value = newDate
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + 1)
    currentDate.value = newDate
  }
}

const today = () => {
  currentDate.value = new Date()
}

const selectDate = (date) => {
  currentDate.value = new Date(date.date)
  selectedView.value = 'day'
}

const openAddModal = () => {
  modalMode.value = 'add'
  form.value = {
    id: null,
    title: '',
    date: currentDate.value.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:30',
    trainerId: '',
    description: '',
    maxStudents: 20
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveClass = () => {
  // TODO: Save to API
  if (modalMode.value === 'add') {
    const newClass = {
      id: Date.now(),
      ...form.value,
      date: form.value.date
    }
    classes.value.push(newClass)
    alert('เพิ่มคลาสสำเร็จ')
  } else {
    const index = classes.value.findIndex(c => c.id === form.value.id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...form.value }
      alert('แก้ไขคลาสสำเร็จ')
    }
  }
  closeModal()
}

const fetchTrainers = async () => {
  try {
    const response = await $fetch(`${API_BASE_URL}/trainers?status=active`)
    trainers.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching trainers:', err)
  }
}

const fetchCourses = async () => {
  try {
    const response = await $fetch(`${API_BASE_URL}/courses?status=active`)
    courses.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching courses:', err)
  }
}

const openRegistrationsModal = async (classItem) => {
  if (!classItem.courseId) {
    alert('ไม่พบข้อมูลคอร์ส')
    return
  }

  selectedCourse.value = classItem
  showRegistrationsModal.value = true
  loadingRegistrations.value = true
  registrations.value = []

  try {
    const response = await $fetch(`${API_BASE_URL}/registrations?courseId=${classItem.courseId}&type=course`)
    registrations.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching registrations:', err)
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ลงทะเบียน: ' + (err.data?.error || err.message))
  } finally {
    loadingRegistrations.value = false
  }
}

const closeRegistrationsModal = () => {
  showRegistrationsModal.value = false
  selectedCourse.value = null
  registrations.value = []
}

const getPaymentStatusText = (status) => {
  const statusMap = {
    'pending': 'รอชำระเงิน',
    'completed': 'ชำระเงินแล้ว',
    'failed': 'ชำระเงินล้มเหลว',
    'refunded': 'คืนเงินแล้ว'
  }
  return statusMap[status] || status
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'รอดำเนินการ',
    'confirmed': 'ยืนยันแล้ว',
    'completed': 'เสร็จสิ้น',
    'cancelled': 'ยกเลิก'
  }
  return statusMap[status] || status
}

const formatRegistrationDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`
}

onMounted(() => {
  fetchTrainers()
  fetchCourses()
})
</script>

