<template>
  <Chart v-if="Options" :options="Options" />
</template>

<script setup>
import { useTheme } from "vuetify";
import { computed } from "vue";
import { generateDarkerShades } from "../composables/useGenerateDarkerShades.js";
import { Chart } from "highcharts-vue";
import { useNumberConverter } from "@/composables/useNumberConverter.js";
import { useDateTimeFormatter } from "@/composables/useDateTimeFormatter.js";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const { current } = useTheme();
const props = defineProps({ chartOptions: String });

const Options = computed(() => {
  const chartConfig = JSON.parse(props.chartOptions);
  const primaryColor = current.value.colors.primary;
  if (chartConfig?.chart?.type === "pie")
    chartConfig.colors = generateDarkerShades(primaryColor);
  if (chartConfig?.chart?.type === "area") {
    chartConfig.chart.type = "areaspline";
    chartConfig.series.forEach((series) => {
      series.fillOpacity = 0.1;
    });
  }
  if (chartConfig.yAxis) {
    chartConfig.yAxis.labels = {
      formatter: function () {
        return useNumberConverter(this.value);
      },
    };
  }

  if (chartConfig.xAxis) {
    chartConfig.xAxis.labels = {
      formatter: function () {
        const value = this.value.toString();

        // const timePattern = /(AM|PM|am|pm)/;
        // const datePattern = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}\b/;
        // const isoDatePattern = /^\d{4}-\d{2}-\d{2}/;
        //
        // if (datePattern.test(value) || isoDatePattern.test(value)) {
        //     return useDateTimeFormatter(this.value).date;
        // }
        // if (timePattern.test(value)) {
        //     return useDateTimeFormatter(this.value);
        // }

        return useNumberConverter(this.value);
      },
    };
  }

  if (chartConfig.tooltip) {
    chartConfig.tooltip.formatter = function () {
      if (this.point) {
        return `${this.point.name}: ${useNumberConverter(this.y)}`;
      } else if (this.x) {
        const xValue =
          chartConfig.xAxis?.type === "datetime"
            ? useDateTimeFormatter(this.x)
            : useNumberConverter(this.x);
        return `${this.series.name}: ${xValue} - ${useNumberConverter(this.y)}`;
      }
    };
  }
  chartConfig.credits = {
    enabled: false,
  };

  return chartConfig;
});
</script>
<style lang="scss" scoped>
:deep() {
  .highcharts-background {
    fill: transparent !important;
  }
  .highcharts-axis-labels text,
  .highcharts-legend-item text {
    fill: rgba(var(--v-theme-dark_400), 1) !important;
  }
}
</style>
