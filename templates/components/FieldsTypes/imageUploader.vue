<template>
  <div
    :class="[
      'field',
      {
        'required-field': required,
        '!flex-col !items-start': mode === 'vertical'
      },
      inputStyle,
      classList
    ]"
  >
    <div
      v-if="label"
      :class="{
        '!w-full !max-w-full': mode === 'vertical'
      }"
      class="field-label"
    >
      {{ label }}
    </div>
    <div
      v-if="inputStyle !== 'viewMode'"
      :class="{ '!w-full': mode === 'vertical' }"
      class="uploader"
    >
      <div class="absolute">
        <v-file-input
          class="absolute"
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          :multiple="isMultiple"
          hidden
          hide-details="auto"
          v-model="innerValue"
          :rules="rules"
          :required="required"
          :accept="acceptExtensions"
        />
      </div>
      <div class="uploader__content">
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent
          :class="{ 'items-start !p-4': inputStyle === 'vertical' }"
          class="drop-zone w-full flex flex-col justify-center items-center gap-6"
          @click="selectFile"
        >
          <div
            :class="{ '!flex-row w-full ': inputStyle === 'vertical' }"
            class="flex flex-col justify-center items-center gap-[12px]"
          >
            <span
              :class="{ 'bg-dark_75 !border-0': inputStyle === 'vertical' }"
              class="border border-dark_700 text-dark_700 w-[40px] h-[40px] rounded-[8px] flex justify-center items-center"
              v-html="icons.uploadCloud"
            ></span>
            <div
              :class="{ 'items-start flex-row w-full justify-between': inputStyle === 'vertical' }"
              class="flex flex-col items-center gap-1"
            >
              <div
                :class="{ 'items-start': inputStyle === 'vertical' }"
                class="flex flex-col items-center gap-1"
              >
                <h3
                  :class="{ 'text-dark_bg !text-[14px] !font-[400]': inputStyle === 'vertical' }"
                  class="text-center flex gap-1"
                >
                  <button type="button">
                    {{ t('click_to_download') }}
                  </button>
                  <span>{{ t('drag_drop') }} </span>
                </h3>
                <p
                  :class="{
                    'text-dark_400': inputStyle === 'vertical',
                    'text-dark_700': inputStyle != 'vertical'
                  }"
                  class="!text-[12px]"
                >
                  {{
                    $t('attachments_description', {
                      size:
                        typeof maxSize == 'number'
                          ? sizeToText(maxSize)
                          : sizeToText(sizeToBytes(maxSize)),
                      extension: accept.toUpperCase().replace(/,/g, ', ')
                    })
                  }}
                </p>
              </div>
              <button
                v-if="inputStyle == 'vertical'"
                type="button"
                class="bg-dark_75 px-4 py-2 rounded-[8px] text-dark_bg !font-[500]"
              >
                {{ $t('browse_file') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="inputStyle !== 'viewMode' && errorMessage"
      class="flex justify-between items-center gap-2 maxSize mt-1"
    >
      <div class="text-red">
        {{ errorMessage }}
      </div>
    </div>
    <div v-if="previewUrls.length" class="flex flex-col gap-2 w-100">
      <div
        v-for="(preview, index) in previewUrls"
        :key="index"
        class="flex gap-2 max-h-[96px] p-4 previews__image"
      >
        <div class="flex gap-3 w-100 items-center">
          <span class="flex max-w-full max-h-full w-[100px] file-icon">
            <img v-if="isImageFile(preview)" :src="preview.url" alt="image" />
            <span v-else v-html="getFileIcon(preview)"></span>
          </span>
          <div class="file-details">
            <span class="file-name">{{ preview.name }}</span>
            <span v-if="preview.size" class="file-size">{{ sizeToText(preview.size) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2" v-if="inputStyle !== 'viewMode'">
          <v-btn class="close" size="small" elevation="0" @click="removeImage(index)">
            <span v-html="icons.close"></span>
          </v-btn>
        </div>
      </div>
    </div>
    <div v-if="inputStyle === 'viewMode' && !value" class="text-dark_bg">
      {{ $t('no_found') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { icons } from '@/plugins/icons'
import { bytesToSize, sizeToText, sizeToBytes } from '@/utils/bytesCalculator'

const emit = defineEmits(['imageSelected', 'imageRemoved', 'update:modelValue', 'filesChanged'])

const { t } = useI18n()
const props = defineProps({
  label: { type: [String, Boolean], default: '' },
  required: { type: Boolean, default: false },
  settingKey: String,
  classList: String,
  mode: { type: String, default: 'horizontal' },
  inputStyle: { type: String, default: '' },
  rules: { type: Array, default: () => [] },
  accept: { type: String, default: '' },
  imagesUrls: { type: [Array, String, Object], default: () => '' },
  value: { type: [String, Array], default: '' },
  isMultiple: { type: Boolean, default: false },
  max: { type: [Number, String], default: 5 }, // Increased default for isMultiple files
  maxSize: { type: String, default: sizeToBytes('50 MB') },
  modelValue: { type: [String, Array, File, Object], default: null }
})

const innerValue = ref(props.value || props.modelValue)
const fileInput = ref(null)
const errorMessage = ref(null)
const uploadedFiles = ref([]) // Store actual file objects
const previewUrls = ref([]) // Store preview URLs with metadata

const allowedExtensions = computed(() => {
  return props.accept ? props.accept.split(',').map((ext) => ext.trim().toLowerCase()) : []
})

const acceptExtensions = computed(() => {
  return allowedExtensions.value.length
    ? allowedExtensions.value.map((ext) => `.${ext}`).join(',')
    : ''
})

// Initialize previews on component mount
const initializePreviews = () => {
  const currentValue = props.value || props.modelValue || props.imagesUrls
  if (!currentValue) return
  clearPreviews()
  if (Array.isArray(currentValue)) {
    currentValue.forEach((item) => {
      if (item instanceof File) addPreviewFromFile(item)
      else if (typeof item === 'string' && !item.startsWith('data:')) addPreviewFromUrl(item)
    })
  } else if (currentValue instanceof File) {
    addPreviewFromFile(currentValue)
  } else if (
    typeof currentValue === 'string' &&
    currentValue.trim() !== '' &&
    !currentValue.startsWith('data:')
  ) {
    addPreviewFromUrl(currentValue)
  }
}

const addPreviewFromUrl = (url) => {
  const fileName = getFileNameFromUrl(url)
  previewUrls.value.push({
    url,
    name: fileName,
    type: getFileTypeFromUrl(url),
    size: null,
    isExternal: true
  })
}

const addPreviewFromFile = (file) => {
  const blobUrl = URL.createObjectURL(file)
  previewUrls.value.push({
    url: blobUrl,
    name: file.name,
    type: file.type,
    size: file.size,
    originalFile: file
  })
  uploadedFiles.value.push(file)
}

const clearPreviews = () => {
  // Clean up blob URLs to prevent memory leaks
  previewUrls.value.forEach((preview) => {
    if (preview.url.startsWith('blob:') && !preview.isExternal) {
      URL.revokeObjectURL(preview.url)
    }
  })
  previewUrls.value = []
  uploadedFiles.value = []
}

const removeImage = (index) => {
  // Revoke blob URL to prevent memory leaks
  if (previewUrls.value[index] && previewUrls.value[index].url.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrls.value[index].url)
  }

  previewUrls.value.splice(index, 1)
  uploadedFiles.value.splice(index, 1)

  emit('imageRemoved', { key: props.settingKey, index })
  const emitValue = props.isMultiple ? uploadedFiles.value : uploadedFiles.value[0] || null
  emit('update:modelValue', emitValue)
  emit('filesChanged', uploadedFiles.value)
}

const selectFile = () => {
  if (fileInput.value) fileInput.value.value = ''
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  handleFiles(files)
}

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  handleFiles(files)
}

const handleFiles = (files) => {
  errorMessage.value = null

  // Clear existing files if not isMultiple
  if (!props.isMultiple) {
    clearPreviews()
  }

  // Check if adding these files would exceed the maximum
  if (props.isMultiple && previewUrls.value.length + files.length > props.max) {
    errorMessage.value = t('limit_files_count', {
      max: props.max,
      current: previewUrls.value.length,
      trying: files.length
    })
    return
  }

  const validFiles = []

  for (const file of files) {
    // Check file size
    if (sizeToBytes(props.maxSize) && file.size > sizeToBytes(props.maxSize)) {
      errorMessage.value = t('limit_file_size', {
        filename: file.name,
        maxSize: typeof props.maxSize === 'string' ? props.maxSize : sizeToText(props.maxSize)
      })
      continue
    }

    // Check file extension
    if (
      allowedExtensions.value.length &&
      !allowedExtensions.value.includes(file.name.split('.').pop().toLowerCase())
    ) {
      errorMessage.value = t('limit_file_extension', {
        filename: file.name,
        allowedTypes: props.accept.toUpperCase().replace(/,/g, ', ')
      })
      continue
    }

    // Check for duplicate files (by name and size)
    const isDuplicate = uploadedFiles.value.some(
      (existingFile) => existingFile.name === file.name && existingFile.size === file.size
    )

    if (isDuplicate) {
      errorMessage.value = t('duplicate_file', { filename: file.name })
      continue
    }

    validFiles.push(file)
  }

  // Process valid files
  validFiles.forEach((file) => processFile(file))

  // Pass data to parent
  if (validFiles.length > 0) {
    const emitValue = props.isMultiple ? uploadedFiles.value : uploadedFiles.value[0] || null
    passingDataToParent(emitValue)
    emit('filesChanged', uploadedFiles.value)
  }
}

const processFile = (file) => {
  // Store the actual file object
  uploadedFiles.value.push(file)

  // Create preview URL for display
  const blobUrl = URL.createObjectURL(file)
  previewUrls.value.push({
    url: blobUrl,
    name: file.name,
    type: file.type,
    size: file.size,
    originalFile: file
  })
}

const passingDataToParent = (data) => {
  emit('imageSelected', { [props.settingKey]: data })
  emit('update:modelValue', data)
}

watch(
  () => [props.value, props.modelValue, props.imagesUrls],
  () => initializePreviews(),
  { deep: true }
)

const isImageFile = (preview) => {
  if (preview.type) {
    return preview.type.startsWith('image/')
  }
  if (preview.url) {
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    return extensions.some((ext) => preview.url.toLowerCase().includes(`.${ext}`))
  }
  return false
}

const getFileIcon = (preview) => {
  const filename = preview.name
  if (filename) {
    const extension = filename.split('.').pop().toLowerCase()
    switch (extension) {
      case 'pdf':
        return icons.pdf
      case 'doc':
      case 'docx':
        return icons.doc
      case 'xls':
      case 'xlsx':
        return icons.xlsx
      case 'zip':
      case 'rar':
        return icons.zip
      case 'mp4':
      case 'mov':
      case 'wmv':
      case 'avi':
      case 'flv':
      case 'mkv':
        return icons.video
      default:
        return icons.fileIcon || 'fileIcon'
    }
  }
  return icons.fileIcon || 'fileIcon'
}

const getFileNameFromUrl = (url) => {
  if (typeof url === 'string') {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const filename = pathname.split('/').pop()

      // If filename has extension, return it
      if (filename && filename.includes('.')) return filename
      // If no extension, try to determine from URL or use generic name
      const extension = getExtensionFromMimeType(getFileTypeFromUrl(url))
      return filename ? `${filename}.${extension}` : `file.${extension}`
    } catch (error) {
      // If URL parsing fails, extract filename from path
      const urlParts = url.split('/')
      const lastPart = urlParts[urlParts.length - 1].split('?')[0]
      return lastPart || 'uploaded-file'
    }
  }
  return 'Unknown File'
}

const getExtensionFromMimeType = (mimeType) => {
  const mimeToExt = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-ms-wmv': 'wmv',
    'video/x-msvideo': 'avi',
    'video/x-flv': 'flv',
    'video/x-matroska': 'mkv'
  }
  return mimeToExt[mimeType] || 'jpg'
}

const getFileTypeFromUrl = (url) => {
  if (typeof url === 'string') {
    const extension = url.split('.').pop().toLowerCase().split('?')[0]
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      wmv: 'video/x-ms-wmv',
      avi: 'video/x-msvideo',
      flv: 'video/x-flv',
      mkv: 'video/x-matroska'
    }
    return mimeTypes[extension] || 'image/jpeg' // Default to image for unknown URLs
  }
  return 'application/octet-stream'
}

onMounted(() => initializePreviews())

onBeforeUnmount(() => clearPreviews())
</script>

<style lang="scss" scoped>
.maxSize {
  font-size: 12px;
  margin-top: -10px;
}

.files-count {
  font-size: 14px;
  color: rgba(var(--v-theme-primary), 1);
  font-weight: 500;
  padding: 8px 12px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
  margin-bottom: 8px;
}

.file-icon {
  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .file-name {
    color: #161616;
    font-size: 14px;
    font-weight: 500;
  }

  .file-size {
    color: rgba(var(--v-theme-dark_700), 1);
    font-size: 12px;
  }
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;

  .file-name {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
}

:deep() {
  .v-input {
    position: relative;
    width: 100%;
    height: 100%;
    .v-field__input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
  .v-input__prepend,
  .v-input__control {
    display: none;
  }
  .v-input__details {
    text-align: center;
    bottom: 10px;
  }
}

.uploader {
  position: relative;
  &__content {
    position: relative;
    width: 100%;
    min-width: 250px;
    height: 126px;
    background-color: rgba(var(--v-theme-dark_white), 1);
    border: 1px solid rgba(var(--v-theme-dark_100), 1);
    padding: 24px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    cursor: pointer;

    .drop-zone {
      position: absolute;
      top: 0;
      left: 50%;
      height: 100%;
      transform: translateX(-50%);
    }
  }

  .absolute {
    width: 100%;
    height: 104%;
    :deep(.v-messages__message) {
      text-align: start !important;
    }
  }

  &__btn {
    color: #161616;
    font-weight: 500;
  }

  .text-sm {
    font-size: 12px;
  }

  .text-xs {
    font-size: 11px;
    font-style: italic;
  }
}
.previews {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  &__image {
    position: relative;
    flex: 1;
    width: 100%;
    padding: 8px;
    height: 100%;
    background-color: #ffffff;
    border: 1px solid #ebf0f7;
    border-radius: 16px;

    :deep(.v-btn) {
      width: 20px;
      height: 20px;
      cursor: pointer;
      min-width: 0;
      padding: 0 !important;
      background-color: transparent !important;

      &.close {
        background-color: rgba(var(--v-theme-error), 0.4) !important;
        color: rgba(var(--v-theme-error), 1) !important;
      }

      .v-btn__overlay,
      .v-btn__underlay,
      &::after {
        display: none;
      }
      .v-btn__content {
        width: 20px;
        height: 20px;

        svg {
          width: 12px !important;
          height: 12px !important;
        }
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  .uploader-cancel--custom {
    position: absolute;
    bottom: 10px;
    left: 10px;
    cursor: pointer;
  }
}

.v-theme--dark {
  .uploader {
    border: 2px dashed rgba(var(--v-theme-dark_25), 1);
    &__content {
      background: rgba(var(--v-theme-dark_25), 1);
    }
  }

  .files-count {
    background-color: rgba(var(--v-theme-primary), 0.2);
  }
}
.vertical {
  .uploader {
    &__content {
      height: 78px;
      border-radius: 16px;
    }
  }
}
</style>
