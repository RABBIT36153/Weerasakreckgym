<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการเนื้อหา</h1>
      <p class="text-gray-400">จัดการเนื้อหาส่วนล่างสุดของหน้าแรก - สามารถเพิ่ม/ลบช่องและเลือกระหว่าง Text Editor หรือ Upload รูปภาพ</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <!-- Enable/Disable Section -->
        <div class="card mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white mb-1">แสดงเนื้อหาส่วนนี้</h2>
              <p class="text-sm text-gray-400">เปิด/ปิดการแสดงเนื้อหาส่วนนี้ในหน้าแรก</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="contentSettings.enabled" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
            </label>
          </div>
        </div>

        <!-- Title -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">หัวข้อ</h2>
          <input 
            type="text" 
            v-model="contentSettings.title"
            class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
            placeholder="หัวข้อเนื้อหา"
          />
        </div>

        <!-- Content Items -->
        <div class="space-y-6">
          <div 
            v-for="(item, index) in contentSettings.items" 
            :key="index"
            class="card"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-white">ช่องที่ {{ index + 1 }}</h3>
              <div class="flex items-center gap-2">
                <!-- Type Selector -->
                <select 
                  v-model="item.type"
                  class="px-3 py-1 bg-dark-card border border-dark-border rounded text-white text-sm focus:outline-none focus:border-red-primary"
                  @change="handleTypeChange(index)"
                >
                  <option value="text">Text Editor</option>
                  <option value="image">Upload รูปภาพ</option>
                </select>
                
                <!-- Remove Button -->
                <button
                  @click="removeItem(index)"
                  v-if="contentSettings.items.length > 1"
                  class="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  title="ลบช่องนี้"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Text Editor -->
            <div v-if="item.type === 'text'">
              <div :ref="el => quillEditorRefs[index] = el" class="quill-editor"></div>
            </div>

            <!-- Image Upload -->
            <div v-else class="space-y-3">
              <div v-if="item.content" class="relative">
                <img
                  :src="getImageUrl(item.content)"
                  alt="Uploaded Image"
                  class="w-full max-w-2xl mx-auto rounded-lg border border-dark-border"
                  @error="handleImageError"
                />
                <button
                  @click="removeImage(index)"
                  class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <input
                :ref="el => imageInputs[index] = el"
                type="file"
                accept="image/*"
                @change="handleImageUpload($event, index)"
                :disabled="uploadingImages[index]"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p class="text-sm text-gray-500">อัปโหลดรูปภาพ</p>
            </div>
          </div>

          <!-- Add New Item Button -->
          <button
            @click="addNewItem"
            class="w-full p-4 border-2 border-dashed border-dark-border rounded-lg text-white hover:border-red-primary hover:bg-red-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>เพิ่มช่องใหม่</span>
          </button>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">ตัวอย่าง</h2>
          <div class="bg-dark-bg rounded-lg p-4 border border-dark-border mb-4 space-y-4 max-h-[600px] overflow-y-auto">
            <div v-if="contentSettings.enabled">
              <h3 v-if="contentSettings.title" class="text-lg font-bold text-white mb-3">
                {{ contentSettings.title }}
              </h3>
              <div v-if="contentSettings.items && contentSettings.items.length > 0" class="space-y-4">
                <div 
                  v-for="(item, index) in contentSettings.items" 
                  :key="index"
                  class="border-b border-dark-border pb-4 last:border-0 last:pb-0"
                >
                  <div v-if="item.type === 'text' && item.content">
                    <div 
                      class="text-gray-300 prose prose-invert max-w-none"
                      v-html="item.content"
                    ></div>
                  </div>
                  <div v-else-if="item.type === 'image' && item.content" class="flex justify-center">
                    <img
                      :src="getImageUrl(item.content)"
                      alt="Preview"
                      class="max-w-full h-auto rounded-lg"
                      @error="handleImageError"
                    />
                  </div>
                  <div v-else class="text-gray-500 text-sm text-center py-4">
                    (ว่าง)
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-500 text-sm">ยังไม่มีเนื้อหา</p>
            </div>
            <p v-else class="text-gray-500 text-sm">เนื้อหาส่วนนี้ถูกปิดการแสดงผล</p>
          </div>
          <div v-if="error" class="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {{ error }}
          </div>
          <button 
            @click="saveContentSettings"
            :disabled="saving || isAnyUploading"
            class="btn-primary w-full mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'กำลังบันทึก...' : isAnyUploading ? 'กำลังอัพโหลด...' : 'บันทึกการตั้งค่า' }}
          </button>
          <button 
            @click="resetContentSettings"
            class="btn-secondary w-full"
          >
            รีเซ็ต
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick, computed } from 'vue'

definePageMeta({
  layout: 'admin'
})

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBaseUrl

const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const quillEditorRefs = ref([])
const quillInstances = ref({})
const imageInputs = ref([])
const uploadingImages = ref({})

const contentSettings = ref({
  enabled: false,
  title: '',
  items: [
    {
      type: 'text',
      content: '',
      order: 0
    }
  ]
})

// Check if any image is uploading
const isAnyUploading = computed(() => {
  return Object.values(uploadingImages.value).some(uploading => uploading === true)
})

// Initialize Quill Editor for an item
const initQuill = async (index) => {
  // Wait for ref to be available
  await nextTick()
  
  // Check if already initialized
  if (quillInstances.value[index]) {
    return
  }
  
  // Get the ref - might need to wait a bit more
  let editorRef = quillEditorRefs.value[index]
  if (!editorRef) {
    // Wait a bit more for DOM
    await new Promise(resolve => setTimeout(resolve, 100))
    editorRef = quillEditorRefs.value[index]
  }
  
  if (!editorRef) {
    console.warn(`Quill editor ref not found for index ${index}`)
    return
  }

  // Check if already has Quill instance
  if (editorRef.querySelector('.ql-container')) {
    console.warn(`Quill already initialized for index ${index}`)
    return
  }

  try {
    const Quill = (await import('quill')).default

    const modules = {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: () => imageHandlerForQuill(index)
        }
      }
    }

    quillInstances.value[index] = new Quill(editorRef, {
      theme: 'snow',
      modules: modules,
      placeholder: 'เริ่มพิมพ์เนื้อหาของคุณ...'
    })

    // Apply dark theme
    await nextTick()
    applyDarkTheme(index)

    // Watch for content changes
    quillInstances.value[index].on('text-change', () => {
      if (contentSettings.value.items[index]) {
        contentSettings.value.items[index].content = quillInstances.value[index].root.innerHTML
      }
    })

    // Load existing content after initialization
    await nextTick()
    if (contentSettings.value.items[index] && contentSettings.value.items[index].content) {
      const content = contentSettings.value.items[index].content
      // Only set if different to avoid infinite loop
      if (quillInstances.value[index].root.innerHTML !== content) {
        quillInstances.value[index].root.innerHTML = content
      }
    }

  } catch (err) {
    console.error('Error initializing Quill:', err)
  }
}

// Image handler for Quill
const imageHandlerForQuill = (index) => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files[0]
    if (file) {
      await uploadAndInsertImageToQuill(file, index)
    }
  }
}

// Upload and insert image to Quill
const uploadAndInsertImageToQuill = async (file, index) => {
  uploadingImages.value[index] = true
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      const imageUrl = getImageUrl(response.url)
      
      if (quillInstances.value[index] && imageUrl) {
        const range = quillInstances.value[index].getSelection(true)
        quillInstances.value[index].insertEmbed(range.index, 'image', imageUrl, 'user')
        quillInstances.value[index].setSelection(range.index + 1)
      }
    }
  } catch (err) {
    console.error('Error uploading image:', err)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (err.data?.statusMessage || err.message))
  } finally {
    uploadingImages.value[index] = false
  }
}

// Handle image upload
const handleImageUpload = async (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  uploadingImages.value[index] = true
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      if (contentSettings.value.items[index]) {
        contentSettings.value.items[index].content = response.url
      }
    }
  } catch (err) {
    console.error('Error uploading image:', err)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (err.data?.statusMessage || err.message))
  } finally {
    uploadingImages.value[index] = false
    if (imageInputs.value[index]) {
      imageInputs.value[index].value = ''
    }
  }
}

// Remove image
const removeImage = (index) => {
  if (contentSettings.value.items[index]) {
    contentSettings.value.items[index].content = ''
  }
  if (imageInputs.value[index]) {
    imageInputs.value[index].value = ''
  }
}

// Get image URL
const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  if (url.startsWith('/uploads/')) {
    return `/api/uploads/${url.replace('/uploads/', '')}`
  }
  return `/api/uploads/${url}`
}

const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src)
}

// Handle type change
const handleTypeChange = async (index) => {
  // Clear content when changing type
  if (contentSettings.value.items[index]) {
    contentSettings.value.items[index].content = ''
  }
  
  // If changing to text, initialize Quill
  if (contentSettings.value.items[index].type === 'text') {
    await nextTick()
    await initQuill(index)
  }
}

// Add new item
const addNewItem = async () => {
  const newOrder = contentSettings.value.items.length
  contentSettings.value.items.push({
    type: 'text',
    content: '',
    order: newOrder
  })
  
  await nextTick()
  // Initialize Quill for the new text item
  const newIndex = contentSettings.value.items.length - 1
  if (contentSettings.value.items[newIndex].type === 'text') {
    await initQuill(newIndex)
  }
}

// Remove item
const removeItem = async (index) => {
  if (contentSettings.value.items.length <= 1) {
    alert('ต้องมีอย่างน้อย 1 ช่อง')
    return
  }
  
  // Destroy Quill instance if exists
  if (quillInstances.value[index]) {
    delete quillInstances.value[index]
  }
  
  contentSettings.value.items.splice(index, 1)
  
  // Reinitialize all Quill editors after removal
  await nextTick()
  for (let i = 0; i < contentSettings.value.items.length; i++) {
    if (contentSettings.value.items[i].type === 'text') {
      if (!quillInstances.value[i]) {
        await initQuill(i)
      }
    }
  }
}

// Apply dark theme to Quill
const applyDarkTheme = (index) => {
  const editorRef = quillEditorRefs.value[index]
  if (!editorRef) return
  
  nextTick(() => {
    const editor = editorRef.querySelector('.ql-editor')
    const toolbar = editorRef.querySelector('.ql-toolbar')
    
    if (editor) {
      editor.style.backgroundColor = '#1a1a1a'
      editor.style.color = '#ffffff'
      editor.style.minHeight = '300px'
    }
    
    if (toolbar) {
      toolbar.style.backgroundColor = '#2a2a2a'
      toolbar.style.borderColor = '#333333'
    }
    
    const buttons = editorRef.querySelectorAll('.ql-toolbar button, .ql-toolbar .ql-picker')
    buttons.forEach(btn => {
      btn.style.color = '#ffffff'
    })
    
    const labels = editorRef.querySelectorAll('.ql-picker-label')
    labels.forEach(label => {
      label.style.color = '#ffffff'
    })
  })
}

// Fetch content settings from API
const fetchContentSettings = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.content) {
      // Support both new format (items array) and legacy format (single content)
      if (response.content.items && Array.isArray(response.content.items) && response.content.items.length > 0) {
        contentSettings.value = {
          enabled: response.content.enabled !== undefined ? response.content.enabled : false,
          title: response.content.title || '',
          items: response.content.items
        }
      } else if (response.content.content) {
        // Legacy format - convert to new format
        contentSettings.value = {
          enabled: response.content.enabled !== undefined ? response.content.enabled : false,
          title: response.content.title || '',
          items: [{ type: 'text', content: response.content.content, order: 0 }]
        }
      } else {
        // Default: empty items array
        contentSettings.value = {
          enabled: response.content.enabled !== undefined ? response.content.enabled : false,
          title: response.content.title || '',
          items: [{ type: 'text', content: '', order: 0 }]
        }
      }
    } else {
      // No content settings, use default
      contentSettings.value = {
        enabled: false,
        title: '',
        items: [{ type: 'text', content: '', order: 0 }]
      }
    }
    
    // Initialize Quill editors for text items after data is set
    await nextTick()
    await nextTick() // Double nextTick to ensure DOM is ready
    
    for (let i = 0; i < contentSettings.value.items.length; i++) {
      if (contentSettings.value.items[i].type === 'text') {
        // Wait a bit for DOM element to be available
        await new Promise(resolve => setTimeout(resolve, 200))
        if (!quillInstances.value[i]) {
          await initQuill(i)
          // Set content after Quill is initialized
          if (contentSettings.value.items[i].content && quillInstances.value[i]) {
            quillInstances.value[i].root.innerHTML = contentSettings.value.items[i].content
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching content settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
    // Set default on error
    contentSettings.value = {
      enabled: false,
      title: '',
      items: [{ type: 'text', content: '', order: 0 }]
    }
    // Try to initialize first item even on error
    await nextTick()
    await nextTick()
    if (contentSettings.value.items[0] && contentSettings.value.items[0].type === 'text') {
      await new Promise(resolve => setTimeout(resolve, 200))
      await initQuill(0)
    }
  } finally {
    loading.value = false
  }
}

// Save content settings
const saveContentSettings = async () => {
  saving.value = true
  error.value = null
  
  try {
    // Get content from all Quill editors
    for (let i = 0; i < contentSettings.value.items.length; i++) {
      if (contentSettings.value.items[i].type === 'text' && quillInstances.value[i]) {
        contentSettings.value.items[i].content = quillInstances.value[i].root.innerHTML
      }
      // Set order
      contentSettings.value.items[i].order = i
    }
    
    const response = await $fetch(`${API_BASE_URL}/ui-settings/content`, {
      method: 'PUT',
      body: contentSettings.value
    })
    
    if (response) {
      alert('บันทึกการตั้งค่าเนื้อหาสำเร็จ')
      await fetchContentSettings()
    }
  } catch (err) {
    console.error('Error saving content settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    saving.value = false
  }
}

// Reset content settings
const resetContentSettings = async () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    // Destroy all Quill instances
    Object.keys(quillInstances.value).forEach(key => {
      delete quillInstances.value[key]
    })
    
    contentSettings.value = {
      enabled: false,
      title: '',
      items: [{ type: 'text', content: '', order: 0 }]
    }
    
    await nextTick()
    await initQuill(0)
    await saveContentSettings()
  }
}

// Load settings on mount
onMounted(async () => {
  await fetchContentSettings()
  
  // Initialize Quill editors for all text items after data is loaded
  await nextTick()
  for (let i = 0; i < contentSettings.value.items.length; i++) {
    if (contentSettings.value.items[i].type === 'text') {
      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      if (!quillInstances.value[i]) {
        await initQuill(i)
      }
    }
  }
})

// Cleanup
onBeforeUnmount(() => {
  Object.keys(quillInstances.value).forEach(key => {
    quillInstances.value[key] = null
  })
})
</script>

<style>
/* Import Quill styles */
@import 'quill/dist/quill.snow.css';

/* Dark theme overrides for Quill */
.quill-editor .ql-container {
  background-color: #1a1a1a;
  color: #ffffff;
  border-color: #333333;
}

.quill-editor .ql-editor {
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 300px;
}

.quill-editor .ql-toolbar {
  background-color: #2a2a2a;
  border-color: #333333;
}

.quill-editor .ql-toolbar .ql-stroke {
  stroke: #ffffff;
}

.quill-editor .ql-toolbar .ql-fill {
  fill: #ffffff;
}

.quill-editor .ql-toolbar .ql-picker {
  color: #ffffff;
}

.quill-editor .ql-toolbar button:hover,
.quill-editor .ql-toolbar button.ql-active {
  background-color: #dc2626;
}

/* Prose styling for preview */
.prose {
  color: #ffffff;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
</style>
