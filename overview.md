## Inspiration
The inspiration for Pragati came from the glaring educational divide in rural India. Millions of children lack access to quality education due to poor infrastructure, untrained teachers, and limited internet connectivity. We wanted to create a solution that empowers these children with accessible, high-quality learning resources, bridging the gap between urban and rural education.

## What it does
Pragati is an education platform designed for the all-round academic growth of students, especially those studying in rural areas in government schools and Anganwadi centers. It provides structured courses and modules for learning, assessments to test their knowledge, and a special exam preparation section to help them excel in upcoming exams. The platform also includes demo quizzes to strengthen each topic studied. Teachers can upload question papers on the portal, which are reflected as assessment forms in the students' profiles. Additionally, the performance of each student is meticulously tracked to ensure progress.

Currently, the platform supports quiz assessments, tracks scores, and provides a basic offline-first architecture. However, features like multilingual support, SMS-based learning, and advanced analytics are still under development.

## How we built it
- **Frontend**: Built using Vite and ReactJS for a fast and interactive user interface.
- **Backend**: Developed with Python and FastAPI to handle authentication, content delivery, and assessments.
- **Cloud Infrastructure**: Leveraged Google Cloud Platform (GCP) services like Cloud Storage, Firestore, and Cloud Run for scalability and efficiency.
- **Database**: Used MongoDB to store all user data and track students' scores for each test.
- **Notification Services**: Integrated AWS-SNS for sending notifications to users.
- **Additional Features**: Integrated basic quiz functionality and assessment tracking.

## Challenges we ran into
1. **Offline-First Design**: Ensuring seamless offline functionality while syncing data when connectivity is restored.
2. **Content Optimization**: Delivering high-quality educational resources while minimizing data usage.
3. **Teacher Training**: Designing a system that is easy for teachers to adopt and use effectively.

## Accomplishments that we're proud of
- Successfully implemented an offline-first architecture that works in low-connectivity environments.
- Built a scalable backend using GCP services to handle basic quiz and assessment functionalities.

## What we learned
- The importance of designing for inclusivity and accessibility in education.
- How to optimize content delivery for low-bandwidth environments.
- The challenges of integrating multiple cloud services into a cohesive platform.

## What's next for Pragati
1. **Enhanced Content**: Partnering with local teachers and NGOs to create culturally relevant, multilingual content.
2. **AI-Powered Personalization**: Using AI to provide personalized learning paths for students.
3. **Feature Completion**: Implementing SMS-based learning, multilingual support, and advanced analytics.
4. **Government Collaboration**: Seeking government support for device distribution and teacher training programs.