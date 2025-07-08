<template>
  <div class="uploader">
    <label class="uploader__label">
      {{ t(label) }} <span v-if="required" class="required">*</span>
    </label>
    <div class="uploader__input" @click="selectFile">
      <v-icon class="uploader__preview-icon">mdi-image-multiple</v-icon>
      <span class="uploader__text">{{
        t(placeholder) || t("general.upload_file")
      }}</span>
    </div>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      :multiple="multiple"
      hidden
      :accept="accept"
    />
    <div v-if="files.length" class="uploader__files">
      <div v-for="(file, index) in files" :key="index" class="uploader__file">
        <div class="uploader__file__content">
          <template v-if="file.isImage">
            <img
              :src="file.preview"
              alt="Image Preview"
              class="uploader__file-preview"
            />
          </template>
          <template v-else>
            <v-icon size="24" class="file-icon" @click="openFile(file)">
              {{ getFileIcon(file.name) }}
            </v-icon>
          </template>
          <span class="uploader__file-name">{{ file.name }}</span>
        </div>

        <v-btn
          size="28"
          elevation="0"
          rounded="pill"
          @click="removeFile(index)"
          color="error"
        >
          <span v-html="icons.CloseIcon" class="d-flex justify-center"></span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
import { showAlert } from "@/composables/useAlert";
import { bytesToSize } from "@/utils/bytesCalculator";

const emit = defineEmits(["imageSelected", "imageRemoved"]);
const { t } = useI18n();
const props = defineProps({
  settingKey: String,
  accept: {
    type: String,
    default: "/",
  },
  placeholder: String,
  label: String,
  required: Boolean,
  classList: String,
  multiple: Boolean,
  max: {
    type: Number,
    default: 5,
  },
  maxSize: {
    type: Number,
    default: 1024 * 1024,
  },
});

const fileInput = ref(null);
const files = ref([]);
const errorMessage = ref(null);

const removeFile = (index) => {
  files.value.splice(index, 1);
  emit("imageRemoved", { key: props.settingKey, index });
};

const selectFile = () => fileInput.value.click();

const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  handleFiles(selectedFiles);
};

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files);
  handleFiles(files);
};

const handleFiles = (newFiles) => {
  errorMessage.value = null;

  // Ensure files.value is initialized
  if (!files.value) {
    files.value = [];
  }

  // Check if the number of files exceeds the maximum limit
  if (files.value.length + newFiles.length > props.max) {
    errorMessage.value = t("UPLOAD_ERRORS.LIMIT_FILE_COUNT", {
      max: props.max,
    });
    showAlert({ title: errorMessage.value, type: "error" });
    return;
  }

  const validFiles = [];

  newFiles.forEach((file) => {
    if (file.size > props.maxSize) {
      errorMessage.value = t("UPLOAD_ERRORS.LIMIT_FILE_SIZE", {
        maxSize: bytesToSize(props.maxSize),
      });
      return;
    }

    previewFile(file, validFiles);
  });

  if (errorMessage.value) {
    showAlert({ title: errorMessage.value, type: "error" });
  }

  if (validFiles.length) {
    passingDataToParent(validFiles);
  }
};

const previewFile = (file, validFiles) => {
  const reader = new FileReader();
  file.isImage = file.type.startsWith("image");

  if (file.isImage) {
    reader.onload = (e) => {
      file.preview = e.target.result;
      files.value.push(file);
      validFiles.push(file);
    };
    reader.readAsDataURL(file);
  } else {
    file.preview = null;
    files.value.push(file);
    validFiles.push(file);
  }
};

const passingDataToParent = (data) => {
  emit("update:modelValue", files.value);
};

const openFile = (file) => {
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
};

const getFileIcon = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();
  const icons = {
    pdf: "mdi-file-pdf-box",
    doc: "mdi-file-word-box",
    docx: "mdi-file-word-box",
    xls: "mdi-file-excel-box",
    xlsx: "mdi-file-excel-box",
    ppt: "mdi-file-powerpoint-box",
    pptx: "mdi-file-powerpoint-box",
    txt: "mdi-file-document-outline",
    zip: "mdi-folder-zip",
    rar: "mdi-folder-zip",
    default: "mdi-file",
  };
  return icons[ext] || icons.default;
};
</script>

<style scoped lang="scss">
.uploader {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font-weight: 500;
    color: rgba(var(--v-theme-label), 1);
  }

  .required {
    color: red;
  }

  &__input {
    height: 56px;
    background: rgba(var(--v-theme-dark_white), 1);
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
  }

  &__files {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__file {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #f9f9f9;
    width: 100%;
    display: flex;
    justify-content: space-between;
    &__content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  &__file-preview {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }
}

.file-icon {
  cursor: pointer;
  color: #666;
}
</style>
