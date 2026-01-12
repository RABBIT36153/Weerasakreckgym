<template>
  <div>
    <!-- Hero Section -->
    <section 
      class="relative py-20 px-4 min-h-[500px] flex items-center"
      :style="{
        backgroundImage: getCurrentBannerImage() ? `url(${getHeaderImageUrl(getCurrentBannerImage())})` : 'none',
        backgroundColor: getCurrentBannerImage() ? 'transparent' : '#1a1a1a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <!-- Overlay -->
      <div 
        v-if="headerSettings.showOverlay && getCurrentBannerImage()"
        class="absolute inset-0"
        :style="{
          backgroundColor: headerSettings.overlayColor || '#000000',
          opacity: (headerSettings.overlayOpacity || 40) / 100
        }"
      ></div>
      
      <!-- Content -->
      <div class="container mx-auto text-center relative z-10">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-white">
          {{ headerSettings.headerText || 'Weerasakreckgym - สอนมวยไทย ออกกำลังกายด้วยมวย' }}
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {{ headerSettings.subText || 'Weerasakreckgym โรงเรียนสอนมวยไทยคุณภาพ สอนมวยไทยโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย พัฒนาทักษะการต่อสู้และความแข็งแกร่งของคุณ' }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/courses" class="btn-primary text-lg">
            ดูคอร์สเรียน
          </NuxtLink>
          <NuxtLink to="/trainers" class="btn-secondary text-lg">
            ดูครูมวย
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-20 px-4 bg-dark-surface">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">
            {{ servicesSettings.title || 'บริการของเรา' }}
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            {{ servicesSettings.subtitle || 'เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท' }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="(service, index) in (servicesSettings.items || [])" 
            :key="index"
            class="card text-center hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105 group"
          >
            <div class="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
              <div v-if="service.image" class="w-24 h-24 rounded-lg overflow-hidden bg-white p-2">
                <img
                  :src="getServiceImageUrl(service.image)"
                  :alt="service.title"
                  class="w-full h-full object-contain"
                  @error="handleServiceImageError"
                />
              </div>
              <div v-else class="text-6xl">📦</div>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-red-primary transition-colors">
              {{ service.title || 'บริการ' }}
            </h3>
            <p class="text-gray-400 leading-relaxed">
              {{ service.description || 'คำอธิบายบริการ' }}
            </p>
            <div v-if="service.link" class="mt-4">
              <NuxtLink 
                :to="service.link" 
                class="text-red-primary hover:text-red-hover font-medium transition-colors"
              >
                ดูเพิ่มเติม →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Courses Preview -->
    <section class="py-20 px-4">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-center mb-12 text-white">
          คอร์สยอดนิยม
        </h2>
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
        </div>
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-400">{{ error }}</p>
        </div>
        <div v-else-if="!popularCourses || popularCourses.length === 0" class="text-center py-12">
          <p class="text-gray-400">ยังไม่มีคอร์สยอดนิยม</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="course in popularCourses" :key="course._id || course.id" class="card hover:border-red-primary transition-all duration-300">
            <div class="mb-4">
              <img 
                :src="getImageUrl(course.image)" 
                :alt="course.name"
                class="w-full h-40 object-cover rounded-lg"
                @error="handleImageError($event)"
              />
            </div>
            <h3 class="text-xl font-bold mb-2 text-white">{{ course.name }}</h3>
            <p class="text-gray-400 mb-4">{{ course.description }}</p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-red-primary">{{ formatPrice(course.price) }} บาท</span>
                <span v-if="course.originalPrice && course.originalPrice > course.price" class="text-gray-400 line-through ml-2 text-sm">{{ formatPrice(course.originalPrice) }} บาท</span>
              </div>
              <NuxtLink :to="`/courses`" class="btn-primary text-sm">
                ดูรายละเอียด
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action - Invite to Learn Muay Thai -->
    <section class="py-20 px-4 bg-gradient-to-br from-red-900/30 via-dark-surface to-dark-bg relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-64 h-64 bg-red-primary rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-red-primary rounded-full blur-3xl"></div>
      </div>
      
      <div class="container mx-auto relative z-10">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
            เชิญชวนเรียนมวยไทย
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column - ประโยชน์ที่คุณจะได้รับ -->
            <div class="card bg-dark-card/80 backdrop-blur-sm border-2 border-red-primary/30">
              <h3 class="text-3xl font-bold mb-6 text-white text-center">
                ประโยชน์ที่คุณจะได้รับ
              </h3>
              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-14 h-14 bg-red-primary rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-semibold text-white mb-2">เฟิร์มกระชับทุกส่วน</h4>
                    <p class="text-gray-300">ออกกำลังกายทุกส่วนของร่างกาย กระชับกล้ามเนื้อ และลดไขมัน</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-14 h-14 bg-red-primary rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-semibold text-white mb-2">เพิ่มความแข็งแรงและความอึด</h4>
                    <p class="text-gray-300">พัฒนาความแข็งแรงของกล้ามเนื้อและความทนทานของร่างกาย</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-14 h-14 bg-red-primary rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-semibold text-white mb-2">ฝึกสมาธิและความมั่นใจ</h4>
                    <p class="text-gray-300">พัฒนาสมาธิและสร้างความมั่นใจในตนเอง</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-14 h-14 bg-red-primary rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-semibold text-white mb-2">ผ่อนคลายความเครียด</h4>
                    <p class="text-gray-300">ปลดปล่อยความเครียดและความกดดันจากการออกกำลังกาย</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-14 h-14 bg-red-primary rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-semibold text-white mb-2">ได้เรียนทักษะการป้องกันตัวจริงใช้ได้จริง</h4>
                    <p class="text-gray-300">เรียนรู้เทคนิคการป้องกันตัวที่สามารถนำไปใช้ได้จริงในชีวิตประจำวัน</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Column - เนื้อหาเชิญชวน -->
            <div class="flex flex-col justify-center">
              <div class="space-y-6">
                <p class="text-xl md:text-2xl text-gray-200 leading-relaxed">
                  เปิดประสบการณ์การออกกำลังกายแบบใหม่ ที่ทั้ง <span class="text-red-primary font-bold">สนุก</span> <span class="text-red-primary font-bold">ฟิต</span> และได้<span class="text-red-primary font-bold">ศิลปะป้องกันตัว</span> กับ <span class="text-yellow-400 font-bold">มวยไทยศิลปะแห่งนักสู้</span> ของคนไทย! ✨
                </p>
                <p class="text-lg text-gray-300 leading-relaxed">
                  เหมาะสำหรับทุกวัย ทุกระดับ เริ่มต้นได้แม้ไม่เคยมีพื้นฐาน ครูผู้สอนดูแลอย่างใกล้ชิด 🔥
                </p>
              </div>
              
              <div class="mt-8 flex flex-col sm:flex-row gap-4">
                <NuxtLink to="/courses" class="btn-primary text-lg px-8 py-4 text-xl text-center">
                  เริ่มเรียนมวยไทยวันนี้
                </NuxtLink>
                <NuxtLink to="/trainers" class="btn-secondary text-lg px-8 py-4 text-xl text-center">
                  ดูครูมวยของเรา
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gym/Stadium Section -->
    <section class="py-20 px-4 bg-dark-surface">
      <div class="container mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">
            สนามมวย Weerasakreckgym
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            สนามมวยมาตรฐานพร้อมอุปกรณ์ครบครัน สำหรับการฝึกซ้อมและแข่งขัน
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- Left Column - Text Content -->
          <div class="space-y-6">
            <div class="card">
              <h3 class="text-2xl font-bold mb-4 text-white">
                สนามมวยมาตรฐาน
              </h3>
              <p class="text-gray-300 leading-relaxed mb-4">
                สนามมวย Weerasakreckgym เป็นสนามมวยมาตรฐานที่ออกแบบมาเพื่อการฝึกซ้อมและแข่งขันอย่างมืออาชีพ พร้อมอุปกรณ์ครบครันและสิ่งอำนวยความสะดวกที่ทันสมัย
              </p>
              <ul class="text-gray-300 space-y-2 list-disc list-inside">
                <li>สนามมวยมาตรฐานขนาด 7x7 เมตร</li>
                <li>อุปกรณ์ฝึกซ้อมครบครัน (กระสอบทราย, เป้าตี, หมัด, นวม)</li>
                <li>พื้นที่วอร์มอัพและยืดกล้ามเนื้อ</li>
                <li>ห้องน้ำและห้องเปลี่ยนเสื้อผ้า</li>
                <li>ระบบระบายอากาศที่ดี</li>
                <li>แสงสว่างเพียงพอสำหรับการฝึกซ้อม</li>
              </ul>
            </div>
            
            <div class="card">
              <h3 class="text-2xl font-bold mb-4 text-white">
                เหมาะสำหรับทุกคน
              </h3>
              <p class="text-gray-300 leading-relaxed">
                ไม่ว่าคุณจะเป็นผู้เริ่มต้นหรือนักมวยมืออาชีพ สนามมวยของเราพร้อมรองรับการฝึกซ้อมทุกระดับ ครูมวยมืออาชีพของเราจะดูแลและแนะนำเทคนิคที่ถูกต้องให้คุณ
              </p>
            </div>
          </div>
          
          <!-- Right Column - Features -->
          <div class="space-y-6">
            <div class="card">
              <h3 class="text-2xl font-bold mb-4 text-white">
                จุดเด่นของสนามมวย
              </h3>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-red-primary rounded-full flex items-center justify-center mr-3 mt-1">
                    <span class="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-1">ความปลอดภัย</h4>
                    <p class="text-gray-300 text-sm">อุปกรณ์และสนามมวยได้รับการตรวจสอบความปลอดภัยอย่างสม่ำเสมอ</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-red-primary rounded-full flex items-center justify-center mr-3 mt-1">
                    <span class="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-1">มาตรฐานสากล</h4>
                    <p class="text-gray-300 text-sm">สนามมวยได้มาตรฐานสากล เหมาะสำหรับการแข่งขันและฝึกซ้อม</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-red-primary rounded-full flex items-center justify-center mr-3 mt-1">
                    <span class="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-1">บรรยากาศดี</h4>
                    <p class="text-gray-300 text-sm">บรรยากาศที่เอื้อต่อการฝึกซ้อม มีพื้นที่เพียงพอและสะอาด</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-red-primary rounded-full flex items-center justify-center mr-3 mt-1">
                    <span class="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-1">ครูมวยมืออาชีพ</h4>
                    <p class="text-gray-300 text-sm">ครูมวยที่มีประสบการณ์พร้อมให้คำแนะนำและดูแลอย่างใกล้ชิด</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-primary/30">
              <h3 class="text-2xl font-bold mb-4 text-white">
                เริ่มต้นวันนี้
              </h3>
              <p class="text-gray-300 leading-relaxed mb-4">
                มาเยี่ยมชมสนามมวยของเราและสัมผัสประสบการณ์การฝึกซ้อมมวยไทยที่แท้จริง
              </p>
              <NuxtLink to="/contact" class="btn-primary inline-block">
                ติดต่อเรา
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trainers Section -->
    <section class="py-20 px-4">
      <div class="container mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">
            ครูมวยของเรา
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            ครูมวยมืออาชีพที่มีประสบการณ์ พร้อมสอนและดูแลคุณอย่างใกล้ชิด
          </p>
        </div>
        
        <div v-if="loadingTrainers" class="text-center py-12">
          <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
        </div>
        <div v-else-if="errorTrainers" class="text-center py-12">
          <p class="text-red-400">{{ errorTrainers }}</p>
        </div>
        <div v-else-if="!featuredTrainers || featuredTrainers.length === 0" class="text-center py-12">
          <p class="text-gray-400">ยังไม่มีข้อมูลครูมวย</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div
            v-for="trainer in featuredTrainers"
            :key="trainer._id || trainer.id"
            class="card hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105"
          >
            <div class="text-center mb-4">
              <div class="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-red-primary">
                <img 
                  :src="getImageUrl(trainer.image)" 
                  :alt="trainer.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError($event, trainer.name)"
                />
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">{{ trainer.name }}</h3>
              <p class="text-red-primary font-semibold mb-2">{{ trainer.title }}</p>
              <div class="flex items-center justify-center mb-4">
                <span class="text-yellow-400 mr-1">⭐</span>
                <span class="text-gray-300">{{ trainer.rating || '5.0' }}</span>
                <span class="text-gray-500 ml-2">({{ trainer.reviews || '0' }} รีวิว)</span>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-300 mb-2">ความเชี่ยวชาญ:</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in (trainer.skills || [])"
                  :key="skill"
                  class="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-400 border border-dark-border"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-300 mb-2">ประสบการณ์:</h4>
              <p class="text-gray-400 text-sm">{{ trainer.experience || 'มีประสบการณ์สอนมวยไทย' }}</p>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-semibold text-gray-300 mb-2">ค่าเรียน:</h4>
              <p class="text-red-primary font-bold text-lg">
                {{ typeof trainer.price === 'number' ? trainer.price.toLocaleString('th-TH') : (trainer.price || '0') }} บาท/เดือน
              </p>
            </div>

            <NuxtLink :to="`/trainers`" class="btn-primary w-full text-center block">
              เลือกครูมวยนี้
            </NuxtLink>
          </div>
        </div>
        
        <div class="text-center">
          <NuxtLink to="/trainers" class="btn-secondary text-lg px-8 py-4">
            ดูครูมวยทั้งหมด
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section 
      v-if="contentSettings && contentSettings.enabled && (contentSettings.title || (contentSettings.items && Array.isArray(contentSettings.items) && contentSettings.items.length > 0))"
      class="py-20 bg-dark-surface"
    >
      <div class="container mx-auto">
        <div v-if="contentSettings && contentSettings.title" class="text-center mb-12 px-4">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">
            {{ contentSettings.title }}
          </h2>
        </div>
        <div v-if="contentSettings && contentSettings.items && Array.isArray(contentSettings.items) && contentSettings.items.length > 0" class="space-y-0">
          <div 
            v-for="(item, index) in sortedContentItems" 
            :key="index"
            class="content-item"
          >
            <!-- Text Content -->
            <div 
              v-if="item.type === 'text' && item.content"
              class="prose prose-invert max-w-none text-gray-300 px-4 max-w-4xl mx-auto py-8"
              v-html="item.content"
            ></div>
            
            <!-- Image Content -->
            <div 
              v-else-if="item.type === 'image' && item.content"
              class="w-full"
              style="padding: 20px 10%;"
            >
              <img
                :src="getContentImageUrl(item.content)"
                alt="Content Image"
                class="w-full h-auto object-cover rounded-lg border-4 border-dark-border shadow-2xl"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { public: { apiBaseUrl } } = useRuntimeConfig()
const API_BASE_URL = `${apiBaseUrl}/api`
const popularCourses = ref([])
const loading = ref(false)
const error = ref(null)
const featuredTrainers = ref([])
const loadingTrainers = ref(false)
const errorTrainers = ref(null)
const headerSettings = ref({
  bannerImage: '',
  mobileBannerImage: '',
  headerText: 'ยินดีต้อนรับสู่ Muay Thai Academy',
  subText: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน พัฒนาทักษะการต่อสู้และความแข็งแกร่งของคุณ',
  overlayColor: '#000000',
  overlayOpacity: 40,
  showOverlay: true
})
const loadingHeader = ref(false)

const servicesSettings = ref({
  title: 'บริการของเรา',
  subtitle: 'เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท',
  items: [
    {
      image: '',
      title: 'คอร์สเรียนมวยไทย',
      description: 'เรียนมวยไทยกับครูมวยมืออาชีพ พัฒนาทักษะการต่อสู้ตั้งแต่พื้นฐานไปจนถึงขั้นสูง',
      link: '/courses'
    },
    {
      image: '',
      title: 'ครูมวยมืออาชีพ',
      description: 'เรียนแบบตัวต่อตัวหรือกลุ่มเล็กกับครูมวยที่ผ่านการฝึกอบรมและมีประสบการณ์',
      link: '/trainers'
    },
    {
      image: '',
      title: 'จ้างครูมวยไปต่างประเทศ',
      description: 'บริการจัดหาครูมวยมืออาชีพเพื่อไปสอนยังต่างประเทศ พร้อมดูแลเรื่องเอกสารและวีซ่า',
      link: '/hire-trainer'
    },
    {
      image: '',
      title: 'สมาชิกรายเดือน',
      description: 'แพ็คเกจสมาชิกรายเดือนที่คุ้มค่า เข้าคลาสได้ไม่จำกัด พร้อมสิทธิพิเศษต่างๆ',
      link: '/memberships'
    }
  ]
})

const contentSettings = ref({
  enabled: false,
  title: '',
  items: []
})

// Sort content items by order
const sortedContentItems = computed(() => {
  if (!contentSettings.value || !contentSettings.value.items || !Array.isArray(contentSettings.value.items)) {
    return []
  }
  return [...contentSettings.value.items].sort((a, b) => (a.order || 0) - (b.order || 0))
})

// Fetch header settings from API
const fetchHeaderSettings = async () => {
  loadingHeader.value = true
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.header) {
      headerSettings.value = {
        bannerImage: response.header.bannerImage || '',
        mobileBannerImage: response.header.mobileBannerImage || '',
        headerText: response.header.headerText || 'ยินดีต้อนรับสู่ Muay Thai Academy',
        subText: response.header.subText || 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน พัฒนาทักษะการต่อสู้และความแข็งแกร่งของคุณ',
        overlayColor: response.header.overlayColor || '#000000',
        overlayOpacity: response.header.overlayOpacity || 40,
        showOverlay: response.header.showOverlay !== undefined ? response.header.showOverlay : true
      }
    }
    // Fetch services settings
    if (response && response.services) {
      servicesSettings.value = {
        title: response.services.title || 'บริการของเรา',
        subtitle: response.services.subtitle || 'เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท',
        items: response.services.items && response.services.items.length === 4 
          ? response.services.items.map(item => ({
              image: item.image || item.icon || '', // Support both image and icon for backward compatibility
              title: item.title || '',
              description: item.description || '',
              link: item.link || ''
            }))
          : servicesSettings.value.items // Keep default if not exactly 4
      }
    }
  } catch (err) {
    console.error('Error fetching header settings:', err)
    // Use default values if API fails
  } finally {
    loadingHeader.value = false
  }
}

// Get current banner image based on screen size
const getCurrentBannerImage = () => {
  if (process.client && window.innerWidth < 768 && headerSettings.value.mobileBannerImage) {
    return headerSettings.value.mobileBannerImage
  }
  return headerSettings.value.bannerImage
}

// Get header image URL
const getHeaderImageUrl = (url) => {
  if (!url) return ''
  return getImageUrl(url)
}

// Fetch popular courses from API
const fetchPopularCourses = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/courses/popular`)
    popularCourses.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching popular courses:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์สยอดนิยม'
    popularCourses.value = []
  } finally {
    loading.value = false
  }
}

// Format price with thousand separator
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('th-TH')
}

// Get image URL - handle both local uploads and external URLs
const getImageUrl = (url) => {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // For local uploads, use API server to serve static files
  if (url.startsWith('/uploads/')) {
    return `${apiBaseUrl}${url}`
  }
  // Handle paths without leading slash
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `${apiBaseUrl}${cleanPath}`
  }
  return url
}

const handleImageError = (event) => {
  // Fallback to placeholder if image not found
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

// Get service image URL
const getServiceImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // For local uploads, use API server to serve static files
  if (url.startsWith('/uploads/')) {
    return `${apiBaseUrl}${url}`
  }
  // Handle paths without leading slash
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `${apiBaseUrl}${cleanPath}`
  }
  return url
}

const handleServiceImageError = (event) => {
  // Fallback to placeholder if image not found
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

// Get content image URL
const getContentImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // For local uploads, use API server to serve static files
  if (url.startsWith('/uploads/')) {
    return `${apiBaseUrl}${url}`
  }
  // Handle paths without leading slash
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `${apiBaseUrl}${cleanPath}`
  }
  return url
}

// Fetch content settings from API
const fetchContentSettings = async () => {
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
        // Empty content
        contentSettings.value = {
          enabled: response.content.enabled !== undefined ? response.content.enabled : false,
          title: response.content.title || '',
          items: []
        }
      }
    }
  } catch (err) {
    console.error('Error fetching content settings:', err)
    // Use default values if API fails
  }
}

// SEO Meta Tags
useHead({
  title: 'Weerasakreckgym - สอนมวยไทย ออกกำลังกายด้วยมวย | Muay Thai Academy',
  meta: [
    { name: 'description', content: 'Weerasakreckgym โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย พัฒนาทักษะการต่อสู้และความแข็งแกร่ง คอร์สเรียนมวยไทย ครูมวยมืออาชีพ' },
    { name: 'keywords', content: 'weerasakreckgym, สอนมวยไทย, ออกกำลังกายด้วยมวย, เรียนมวยไทย, คอร์สมวยไทย, ครูมวย, มวยไทย, Muay Thai, Muay Thai Academy, โรงเรียนมวยไทย, ฟิตเนสมวยไทย' },
    { property: 'og:title', content: 'Weerasakreckgym - สอนมวยไทย ออกกำลังกายด้วยมวย' },
    { property: 'og:description', content: 'โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย พัฒนาทักษะการต่อสู้และความแข็งแกร่ง' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Weerasakreckgym - สอนมวยไทย ออกกำลังกายด้วยมวย' },
    { name: 'twitter:description', content: 'โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย' }
  ]
})

// Structured Data (JSON-LD) for SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        'name': 'Weerasakreckgym',
        'alternateName': 'Muay Thai Academy',
        'description': 'โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย พัฒนาทักษะการต่อสู้และความแข็งแกร่ง',
        'sport': 'Muay Thai',
        'offers': {
          '@type': 'Offer',
          'category': 'คอร์สเรียนมวยไทย, สอนมวยไทย, ออกกำลังกายด้วยมวย'
        },
        'keywords': 'weerasakreckgym, สอนมวยไทย, ออกกำลังกายด้วยมวย, เรียนมวยไทย, คอร์สมวยไทย, ครูมวย, มวยไทย'
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Weerasakreckgym',
        'alternateName': 'Muay Thai Academy',
        'description': 'โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ',
        'slogan': 'สอนมวยไทย ออกกำลังกายด้วยมวย'
      })
    }
  ]
})

// Fetch featured trainers from API (exactly same as /trainers page)
const fetchFeaturedTrainers = async () => {
  console.log('fetchFeaturedTrainers called')
  loadingTrainers.value = true
  errorTrainers.value = null
  try {
    // Exact same API call as /trainers page
    const apiUrl = `${API_BASE_URL}/trainers?status=active`
    console.log('API_BASE_URL:', API_BASE_URL)
    console.log('Fetching trainers from:', apiUrl)
    const response = await $fetch(apiUrl)
    console.log('Trainers response:', response)
    const allTrainers = Array.isArray(response) ? response : []
    console.log('All trainers:', allTrainers)
    // Show only first 6 trainers
    featuredTrainers.value = allTrainers.slice(0, 6)
    console.log('Featured trainers:', featuredTrainers.value)
  } catch (err) {
    console.error('Error fetching trainers:', err)
    errorTrainers.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลครูมวย'
    featuredTrainers.value = []
  } finally {
    loadingTrainers.value = false
  }
}

// Note: Using getImageUrl and handleImageError from above (same as /trainers page)

// Load data on mount
onMounted(() => {
  fetchHeaderSettings()
  fetchPopularCourses()
  fetchContentSettings()
  fetchFeaturedTrainers()
})
</script>

<style scoped>
/* Prose styling for content section */
.prose {
  color: #d1d5db;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #ffffff;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose h1 {
  font-size: 2.25em;
}

.prose h2 {
  font-size: 1.875em;
}

.prose h3 {
  font-size: 1.5em;
}

.prose p {
  margin-bottom: 1.25em;
  line-height: 1.75;
}

.prose ul,
.prose ol {
  margin-left: 1.5em;
  margin-bottom: 1.25em;
}

.prose li {
  margin-bottom: 0.5em;
}

.prose strong {
  font-weight: 700;
  color: #ffffff;
}

.prose em {
  font-style: italic;
}

.prose u {
  text-decoration: underline;
}

.prose a {
  color: #dc2626;
  text-decoration: underline;
}

.prose a:hover {
  color: #ef4444;
}

.prose blockquote {
  border-left: 4px solid #dc2626;
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
  color: #9ca3af;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

/* Content section image full width */
.content-item img {
  width: 100%;
  height: auto;
  display: block;
  border: 4px solid #333333;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>

