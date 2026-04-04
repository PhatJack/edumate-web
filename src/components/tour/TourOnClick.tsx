'use client'

import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

type StartDriverOnboardingTourOptions = {
  onComplete?: () => void
}

export function startDriverOnboardingTour(
  options?: StartDriverOnboardingTourOptions,
) {
  if (typeof window === 'undefined') return

  const driverObj = driver({
    nextBtnText: 'Tiếp tục',
    prevBtnText: 'Trước',
    doneBtnText: 'Xong',
    animate: true,
    smoothScroll: true,
    stagePadding: 4,
    stageRadius: 20,
    popoverClass: 'edumate-tour-popover',
    onDestroyed: () => {
      // Save to prevent tour from running again.
      options?.onComplete?.()
    },
    steps: [
      {
        popover: {
          title: 'Chào mừng ba mẹ! 🌟',
          description:
            'Edumate không phải là một chiếc máy giải bài tập khô khan. Chúng mình là người bạn đồng hành, giúp ba mẹ thấu hiểu phương pháp sư phạm để tự tin hướng dẫn con tự tư duy và tìm ra đáp án.',
          side: 'over',
          align: 'center',
        },
      },
      {
        element: '#tour-add-doc',
        popover: {
          title: '1. Gửi bài tập của con 📚',
          description:
            'Bắt đầu bằng việc tải lên sách giáo khoa, chụp ảnh phiếu bài tập hoặc kết nối với Google Drive của lớp nhé.',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '#workspace-source-list',
        popover: {
          title: '2. Không gian học riêng biệt 🗂️',
          description:
            'Mỗi tài liệu sẽ nằm trong một cuộc trò chuyện riêng. Như vậy, Toán và Tiếng Việt của con sẽ không bao giờ bị lẫn lộn vào nhau!',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: '#workspace-footer',
        popover: {
          title: '3. Chọn bài tập mục tiêu 🎯',
          description:
            'Sau khi AI quét xong, ba mẹ nhớ chọn một bài tập cụ thể ở đây nhé. Edumate cần biết ba mẹ đang muốn giảng bài nào để hỗ trợ chính xác nhất!',
          side: 'top',
          align: 'center',
        },
      },
      {
        popover: {
          title: '4. Theo dõi đề bài 📖',
          description:
            'Khi đã chọn bài, nội dung chi tiết sẽ hiện ở khung này. Ba mẹ có thể vừa xem đề, vừa trò chuyện với Edumate mà không cần lật lại sách.',
          side: 'over',
          align: 'center',
        },
      },
      {
        element: '#workspace-exercise-detail',
        popover: {
          title: '5. Hiệu chỉnh dễ dàng ✍️',
          description:
            'Đôi khi ảnh mờ khiến hệ thống đọc nhầm. Ba mẹ chỉ cần nhấn vào đây để sửa lại chữ số cho chuẩn xác nhé.',
          side: 'left',
          align: 'center',
        },
      },
      {
        element: '#reference-solution-section',
        popover: {
          title: '6. Dạy đúng cách của Cô giáo 👩‍🏫',
          description:
            'Tuyệt chiêu đây! Ba mẹ hãy chụp ảnh hoặc ghi chú lại cách cô giáo chữa bài trên lớp vào đây. Edumate sẽ bám sát phương pháp đó để gợi ý, giúp con không bị rối.',
          side: 'left',
          align: 'center',
        },
      },
      {
        element: '#extended-practice-section',
        popover: {
          title: '7. Thực hành cho nhớ lâu 🧩',
          description:
            'Bé làm xong rồi? Ba mẹ hãy yêu cầu tạo thêm bài tương tự (ví dụ: đổi thành quả cam, số nhỏ hơn 10) để con thực hành lại nha!',
          side: 'left',
          align: 'center',
        },
      },
      {
        element: '#tour-profile',
        popover: {
          title: '8. Thấu hiểu con yêu ❤️',
          description:
            'Mỗi bé là một cá thể riêng biệt. Ba mẹ hãy cập nhật tính cách, lực học của con để Edumate có những lời khuyên tâm lý nhất.',
          side: 'left',
          align: 'center',
        },
      },
      {
        popover: {
          title: 'Sẵn sàng rồi! 🚀',
          description:
            'Chuyến tham quan kết thúc. Ba mẹ hãy tải lên tài liệu đầu tiên và cùng Edumate mang đến cho con những giờ học thật vui nhé!',
          side: 'over',
          align: 'center',
        },
      },
    ],
  })

  driverObj.drive()
}

export default function DriverOnboarding() {
  return null
}
