<template>
  <footer class="bg-dark-surface border-t border-dark-border mt-20">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold text-red-primary mb-4">Muay Thai Academy</h3>
          <p class="text-gray-400">
            โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน
          </p>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4">ลิงก์ด่วน</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/courses" class="text-gray-400 hover:text-red-primary transition-colors">คอร์สเรียน</NuxtLink></li>
            <li><NuxtLink to="/trainers" class="text-gray-400 hover:text-red-primary transition-colors">ครูมวย</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-red-primary transition-colors">ติดต่อเรา</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4">ติดต่อเรา</h4>
          <ul class="space-y-2 text-gray-400">
            <li>📞 02-123-4567</li>
            <li>📧 info@muaythai.academy</li>
            <li>📍 กรุงเทพมหานคร</li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-dark-border mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 Muay Thai Academy. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

