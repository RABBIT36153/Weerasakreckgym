<template>
  <div class="min-h-screen bg-dark-bg">
    <AdminNavBar />
    <div class="flex">
      <AdminSidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
</script>

