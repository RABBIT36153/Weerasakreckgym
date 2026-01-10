<template>
  <div class="py-12 px-4">
    <div class="container mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">
          บริการของเรา
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <!-- Service 1 -->
        <div class="card text-center hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105 group">
          <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🥊</div>
          <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-red-primary transition-colors">
            คอร์สเรียนมวยไทย
          </h3>
          <p class="text-gray-400 leading-relaxed mb-6">
            เรียนมวยไทยกับครูมวยมืออาชีพ พัฒนาทักษะการต่อสู้ตั้งแต่พื้นฐานไปจนถึงขั้นสูง
          </p>
          <NuxtLink to="/courses" class="btn-primary">
            ดูคอร์สเรียน
          </NuxtLink>
        </div>

        <!-- Service 2 -->
        <div class="card text-center hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105 group">
          <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">👨‍🏫</div>
          <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-red-primary transition-colors">
            ครูมวยมืออาชีพ
          </h3>
          <p class="text-gray-400 leading-relaxed mb-6">
            เรียนแบบตัวต่อตัวหรือกลุ่มเล็กกับครูมวยที่ผ่านการฝึกอบรมและมีประสบการณ์
          </p>
          <NuxtLink to="/trainers" class="btn-primary">
            ดูครูมวย
          </NuxtLink>
        </div>

        <!-- Service 3 -->
        <div class="card text-center hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105 group">
          <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🌍</div>
          <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-red-primary transition-colors">
            จ้างครูมวยไปต่างประเทศ
          </h3>
          <p class="text-gray-400 leading-relaxed mb-6">
            บริการจัดหาครูมวยมืออาชีพเพื่อไปสอนยังต่างประเทศ พร้อมดูแลเรื่องเอกสารและวีซ่า
          </p>
          <NuxtLink to="/trainers" class="btn-primary">
            จ้างครูมวย
          </NuxtLink>
        </div>

        <!-- Service 4 -->
        <div class="card text-center hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105 group">
          <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💳</div>
          <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-red-primary transition-colors">
            สมาชิกรายเดือน
          </h3>
          <p class="text-gray-400 leading-relaxed mb-6">
            แพ็คเกจสมาชิกรายเดือนที่คุ้มค่า เข้าคลาสได้ไม่จำกัด พร้อมสิทธิพิเศษต่างๆ
          </p>
          <NuxtLink to="/memberships" class="btn-primary">
            ดูแพ็คเกจ
          </NuxtLink>
        </div>
      </div>

      <!-- Additional Info Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
        <div class="card bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30">
          <div class="flex items-start space-x-4">
            <div class="text-5xl">✨</div>
            <div>
              <h3 class="text-2xl font-bold text-white mb-3">ทำไมต้องเลือกเรา?</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-start">
                  <span class="text-red-primary mr-2 mt-1">✓</span>
                  <span>ครูมวยมืออาชีพที่ผ่านการรับรอง</span>
                </li>
                <li class="flex items-start">
                  <span class="text-red-primary mr-2 mt-1">✓</span>
                  <span>อุปกรณ์ฝึกซ้อมที่ทันสมัยและปลอดภัย</span>
                </li>
                <li class="flex items-start">
                  <span class="text-red-primary mr-2 mt-1">✓</span>
                  <span>โปรแกรมการฝึกที่หลากหลาย</span>
                </li>
                <li class="flex items-start">
                  <span class="text-red-primary mr-2 mt-1">✓</span>
                  <span>บรรยากาศการฝึกที่เป็นกันเอง</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30">
          <div class="flex items-start space-x-4">
            <div class="text-5xl">🎯</div>
            <div>
              <h3 class="text-2xl font-bold text-white mb-3">เป้าหมายของเรา</h3>
              <p class="text-gray-300 leading-relaxed mb-4">
                เรามุ่งมั่นที่จะส่งเสริมและพัฒนาศิลปะการต่อสู้มวยไทย พร้อมสร้างชุมชนที่แข็งแกร่งและสนับสนุนกัน
              </p>
              <p class="text-gray-300 leading-relaxed">
                ไม่ว่าคุณจะเป็นผู้เริ่มต้นหรือนักมวยที่มีประสบการณ์ เรามีโปรแกรมที่เหมาะสมสำหรับคุณ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Services page
</script>

