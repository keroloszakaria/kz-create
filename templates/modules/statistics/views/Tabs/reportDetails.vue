<template>
  <main>
    <section>
      <v-row v-if="isLoading">
        <v-col cols="6" md="3" v-for="(item, index) in 4" :key="index">
          <Skeleton
            class="mx-auto border py-3 rounded-lg"
            type="list-item-avatar-two-line"
          />
        </v-col>
      </v-row>
      <v-row v-else>
        <CardStats v-for="card in cards.data" :key="card.key" :card="card" />
      </v-row>
    </section>
    <section class="mt-3">
      <v-row v-if="isLoading">
        <v-col cols="6" v-for="(item, index) in 6" :key="index">
          <Skeleton class="border skeleton_card pa-3 rounded-lg" type="card" />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(chart, indexChart) in Object.values(charts)"
          :key="indexChart"
          :cols="chart.size ? chart.size.cols : '12'"
          :lg="chart.size ? chart.size.lg : '6'"
          :md="chart.size ? chart.size.md : '6'"
        >
          <v-sheet rounded="lg" class="shadow-sm chart_wrapper pa-5 h-full">
            <div class="d-flex align-center justify-space-between">
              <h5 class="mb-3">{{ chart.title }}</h5>
              <ChartTypes
                v-if="chart?.data[chart.type].series.length"
                @updateType="handleChart($event, indexChart)"
                :type="chart.type"
              />
            </div>
            <DynamicChart
              v-if="chart?.data[chart.type].series.length"
              :chartOptions="JSON.stringify(chart.data[chart.type])"
            ></DynamicChart>
            <div
              v-else
              class="no_data_chart h-full text-center min-h-400 d-flex align-center justify-center"
            >
              <NO_CHART_DATA />
            </div>
          </v-sheet>
        </v-col>
        <StatisticsTable
          v-for="table in tables"
          :key="table.title"
          :table="table"
        />
      </v-row>
    </section>
  </main>
</template>

<script setup>
import NO_CHART_DATA from "../../assets/no_data_chart.svg";
import ChartTypes from "../../components/ChartTypes.vue";
import DynamicChart from "../../components/DynamicChart.vue";
import CardStats from "../../components/StatisticsCard.vue";
import StatisticsTable from "../../components/StatisticsTable.vue";
import Skeleton from "../../components/Skeleton.vue";
import { useStatisticsStore } from "@/modules/statistics/stores/statistics.js";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  page: String,
});
const isLoading = ref(false);
const { getReportsData, cards, charts, tables } = useStatisticsStore();

const handleChart = (type, index) => {
  charts[index].type = type;
};
const fetchChartsData = async (date) => {
  let start = null;
  let end = null;
  if (date) {
    start = date[0];
    end = date[1];
  }
  const params = {
    start,
    end,
    page: props.page,
  };
  try {
    isLoading.value = true;
    await getReportsData(params);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchChartsData();
});
</script>

<style lang="scss" scoped>
.chart_wrapper {
  min-height: 500px;
}
</style>
