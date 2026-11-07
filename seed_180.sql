-- FutureSchool 180 Students & Complete Faculty Seed
-- Generated at: 2026-11-07T04:29:00.847Z

BEGIN;

-- Clean existing students and student user accounts
DELETE FROM students;
DELETE FROM user_accounts WHERE role = 'STUDENT';

-- 1. Update/Insert School Classes
INSERT INTO school_classes (id, name, section, grade_number, school_level, active, class_teacher_id, class_teacher_name)
VALUES ('class-10-a', 'Class 10', 'A', 10, 'Senior', true, 'TCH0001', 'Mrs. Sarah Jenkins')
ON CONFLICT (name, section) DO UPDATE SET
  class_teacher_id = EXCLUDED.class_teacher_id,
  class_teacher_name = EXCLUDED.class_teacher_name,
  active = true;
INSERT INTO school_classes (id, name, section, grade_number, school_level, active, class_teacher_id, class_teacher_name)
VALUES ('class-10-b', 'Class 10', 'B', 10, 'Senior', true, 'TCH0002', 'Mr. Raghavan Nair')
ON CONFLICT (name, section) DO UPDATE SET
  class_teacher_id = EXCLUDED.class_teacher_id,
  class_teacher_name = EXCLUDED.class_teacher_name,
  active = true;
INSERT INTO school_classes (id, name, section, grade_number, school_level, active, class_teacher_id, class_teacher_name)
VALUES ('class-9-a', 'Class 9', 'A', 9, 'Senior', true, 'TCH0003', 'Mrs. Ananya Sen')
ON CONFLICT (name, section) DO UPDATE SET
  class_teacher_id = EXCLUDED.class_teacher_id,
  class_teacher_name = EXCLUDED.class_teacher_name,
  active = true;
INSERT INTO school_classes (id, name, section, grade_number, school_level, active, class_teacher_id, class_teacher_name)
VALUES ('class-9-b', 'Class 9', 'B', 9, 'Senior', true, 'TCH0004', 'Mr. Rajeshwar Rao')
ON CONFLICT (name, section) DO UPDATE SET
  class_teacher_id = EXCLUDED.class_teacher_id,
  class_teacher_name = EXCLUDED.class_teacher_name,
  active = true;
INSERT INTO school_classes (id, name, section, grade_number, school_level, active, class_teacher_id, class_teacher_name)
VALUES ('class-8-a', 'Class 8', 'A', 8, 'Senior', true, 'TCH0005', 'Mrs. Meenakshi Sundaram')
ON CONFLICT (name, section) DO UPDATE SET
  class_teacher_id = EXCLUDED.class_teacher_id,
  class_teacher_name = EXCLUDED.class_teacher_name,
  active = true;
INSERT INTO school_classes (id, name, section, grade_number, school_level, active, class_teacher_id, class_teacher_name)
VALUES ('class-8-b', 'Class 8', 'B', 8, 'Senior', true, 'TCH0006', 'Mr. Amit Sharma')
ON CONFLICT (name, section) DO UPDATE SET
  class_teacher_id = EXCLUDED.class_teacher_id,
  class_teacher_name = EXCLUDED.class_teacher_name,
  active = true;

-- 2. Principal & User Account
INSERT INTO user_accounts (id, login_id, password, name, email, role, status, active, created_at, updated_at)
VALUES ('USR-PRN-001', 'PRN0001', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Dr. Shashi Shekhar', 'principal@futureschool.edu', 'PRINCIPAL', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, active = true;

-- 3. Teachers & Teacher User Accounts
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0001', 'TCH0001', 'Mrs. Sarah Jenkins', 'sarah.jenkins@futureschool.edu', '+91 98450 12345', 'Class 10-A Mentor & Science Lead', 'Physical Science', 'M.Sc. (Physics), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0001', 'TCH0001', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mrs. Sarah Jenkins', 'sarah.jenkins@futureschool.edu', 'TEACHER', 'TCH0001', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0002', 'TCH0002', 'Mr. Raghavan Nair', 'raghavan.nair@futureschool.edu', '+91 98450 12346', 'Class 10-B Mentor & Mathematics Lead', 'Mathematics', 'M.Sc. (Math), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0002', 'TCH0002', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mr. Raghavan Nair', 'raghavan.nair@futureschool.edu', 'TEACHER', 'TCH0002', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0003', 'TCH0003', 'Mrs. Ananya Sen', 'ananya.sen@futureschool.edu', '+91 98450 12347', 'Class 9-A Mentor & English Faculty', 'English Literature', 'M.A. (English), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0003', 'TCH0003', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mrs. Ananya Sen', 'ananya.sen@futureschool.edu', 'TEACHER', 'TCH0003', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0004', 'TCH0004', 'Mr. Rajeshwar Rao', 'rajeshwar.rao@futureschool.edu', '+91 98450 12348', 'Class 9-B Mentor & Humanities Lead', 'Social Science', 'M.A. (History), M.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0004', 'TCH0004', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mr. Rajeshwar Rao', 'rajeshwar.rao@futureschool.edu', 'TEACHER', 'TCH0004', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0005', 'TCH0005', 'Mrs. Meenakshi Sundaram', 'meenakshi.sundaram@futureschool.edu', '+91 98450 12349', 'Class 8-A Mentor & Biology Lead', 'Biological Science', 'M.Sc. (Botany), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0005', 'TCH0005', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mrs. Meenakshi Sundaram', 'meenakshi.sundaram@futureschool.edu', 'TEACHER', 'TCH0005', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0006', 'TCH0006', 'Mr. Amit Sharma', 'amit.sharma@futureschool.edu', '+91 98450 12350', 'Class 8-B Mentor & Languages Lead', 'Hindi & Sanskrit', 'M.A. (Hindi), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0006', 'TCH0006', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mr. Amit Sharma', 'amit.sharma@futureschool.edu', 'TEACHER', 'TCH0006', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0007', 'TCH0007', 'Mr. K. V. Raman', 'kv.raman@futureschool.edu', '+91 98450 12351', 'Senior Mathematics Specialist', 'Mathematics', 'M.Sc. (Math), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0007', 'TCH0007', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mr. K. V. Raman', 'kv.raman@futureschool.edu', 'TEACHER', 'TCH0007', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0008', 'TCH0008', 'Dr. Pradeep Verma', 'pradeep.verma@futureschool.edu', '+91 98450 12352', 'Physics & Chemistry Specialist', 'Physical Science', 'Ph.D. (Chemistry), M.Sc.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0008', 'TCH0008', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Dr. Pradeep Verma', 'pradeep.verma@futureschool.edu', 'TEACHER', 'TCH0008', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0009', 'TCH0009', 'Ms. Kavitha Reddy', 'kavitha.reddy@futureschool.edu', '+91 98450 12353', 'Biology & Environmental Science', 'Biological Science', 'M.Sc. (Life Sciences), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0009', 'TCH0009', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ms. Kavitha Reddy', 'kavitha.reddy@futureschool.edu', 'TEACHER', 'TCH0009', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0010', 'TCH0010', 'Mrs. Deepa Murthy', 'deepa.murthy@futureschool.edu', '+91 98450 12354', 'English Language & Communication', 'English', 'M.A. (English), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0010', 'TCH0010', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mrs. Deepa Murthy', 'deepa.murthy@futureschool.edu', 'TEACHER', 'TCH0010', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0011', 'TCH0011', 'Mr. Suresh Patil', 'suresh.patil@futureschool.edu', '+91 98450 12355', 'Geography & Civics Specialist', 'Social Studies', 'M.A. (Geography), B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0011', 'TCH0011', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mr. Suresh Patil', 'suresh.patil@futureschool.edu', 'TEACHER', 'TCH0011', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0012', 'TCH0012', 'Mrs. Suhasini Hegde', 'suhasini.hegde@futureschool.edu', '+91 98450 12356', 'Regional Language Coordinator', 'First Language (Kannada)', 'M.A. (Kannada), Vidwat, B.Ed.', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0012', 'TCH0012', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mrs. Suhasini Hegde', 'suhasini.hegde@futureschool.edu', 'TEACHER', 'TCH0012', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;
INSERT INTO teachers (id, teacher_id, name, email, phone, designation, primary_subject, qualification, active, created_at)
VALUES ('TCH0013', 'TCH0013', 'Mr. Arun Kumar', 'arun.kumar@futureschool.edu', '+91 98450 12357', 'Computer Applications & Robotics', 'Computer Science & AI', 'M.C.A., B.Tech', true, NOW())
ON CONFLICT (teacher_id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, designation = EXCLUDED.designation, primary_subject = EXCLUDED.primary_subject, qualification = EXCLUDED.qualification;
INSERT INTO user_accounts (id, login_id, password, name, email, role, teacher_id, status, active, created_at, updated_at)
VALUES ('USR-TCH0013', 'TCH0013', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mr. Arun Kumar', 'arun.kumar@futureschool.edu', 'TEACHER', 'TCH0013', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, role = 'TEACHER', active = true;

-- 4. Clean and Seed Exactly 180 Students (6 classes x 30 students)

-- Students for Class 10-A (30 Students)
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0002', 'GVS-2027-0002', 'Aarav Iyer', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '1',
      'PAR0001', 'Mr. Deepak Iyer', '9845010001', 'parent.gvs20270002@gmail.com', 'Mr. Deepak Iyer', '9845010001', 'Bank Officer',
      'Mrs. Avani Iyer', 'Homemaker / Professional', '#12, 3th Cross, Jayanagar, Bengaluru - 560011', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4013 5017 1023', 'APAAR-KA-2026-900001', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0002', 'GVS-2027-0002', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aarav Iyer', 'gvs-2027-0002@futureschool.edu', 'STUDENT', 'GVS-2027-0002', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0003', 'GVS-2027-0003', 'Aadhya Malhotra', '2010-07-15', 'Female', 'class-10-a', 'Class 10', 'A', '2',
      'PAR0001', 'Mr. Rohan Malhotra', '9845010002', 'parent.gvs20270003@gmail.com', 'Mr. Rohan Malhotra', '9845010002', 'Professor',
      'Mrs. Kavya Malhotra', 'Homemaker / Professional', '#23, 5th Cross, Rajajinagar, Bengaluru - 560012', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4026 5034 1046', 'APAAR-KA-2026-900002', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0003', 'GVS-2027-0003', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aadhya Malhotra', 'gvs-2027-0003@futureschool.edu', 'STUDENT', 'GVS-2027-0003', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0004', 'GVS-2027-0004', 'Aakash Gupta', '2010-10-22', 'Male', 'class-10-a', 'Class 10', 'A', '3',
      'PAR0001', 'Mr. Dhruv Gupta', '9845010003', 'parent.gvs20270004@gmail.com', 'Mr. Dhruv Gupta', '9845010003', 'Physician',
      'Mrs. Riya Gupta', 'Homemaker / Professional', '#34, 7th Cross, Basavanagudi, Bengaluru - 560013', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4039 5051 1069', 'APAAR-KA-2026-900003', 'AB+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0004', 'GVS-2027-0004', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aakash Gupta', 'gvs-2027-0004@futureschool.edu', 'STUDENT', 'GVS-2027-0004', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0005', 'GVS-2027-0005', 'Aditi Chauhan', '2010-01-01', 'Female', 'class-10-a', 'Class 10', 'A', '4',
      'PAR0001', 'Mr. Utkarsh Chauhan', '9845010004', 'parent.gvs20270005@gmail.com', 'Mr. Utkarsh Chauhan', '9845010004', 'Architect',
      'Mrs. Anika Chauhan', 'Homemaker / Professional', '#45, 9th Cross, HSR Layout, Bengaluru - 560014', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4052 5068 1092', 'APAAR-KA-2026-900004', 'O-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0005', 'GVS-2027-0005', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aditi Chauhan', 'gvs-2027-0005@futureschool.edu', 'STUDENT', 'GVS-2027-0005', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0006', 'GVS-2027-0006', 'Aditya Shenoy', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '5',
      'PAR0001', 'Mr. Kunal Shenoy', '9845010005', 'parent.gvs20270006@gmail.com', 'Mr. Kunal Shenoy', '9845010005', 'Chartered Accountant',
      'Mrs. Nandini Shenoy', 'Homemaker / Professional', '#56, 11th Cross, Malleshwaram, Bengaluru - 560015', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4065 5085 1115', 'APAAR-KA-2026-900005', 'A-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0006', 'GVS-2027-0006', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aditya Shenoy', 'gvs-2027-0006@futureschool.edu', 'STUDENT', 'GVS-2027-0006', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0007', 'GVS-2027-0007', 'Ananya Pandey', '2010-07-15', 'Female', 'class-10-a', 'Class 10', 'A', '6',
      'PAR0001', 'Mr. Sai Pandey', '9845010006', 'parent.gvs20270007@gmail.com', 'Mr. Sai Pandey', '9845010006', 'Entrepreneur',
      'Mrs. Saanvi Pandey', 'Homemaker / Professional', '#67, 1th Cross, Jayanagar, Bengaluru - 560016', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4078 5102 1138', 'APAAR-KA-2026-900006', 'B-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0007', 'GVS-2027-0007', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ananya Pandey', 'gvs-2027-0007@futureschool.edu', 'STUDENT', 'GVS-2027-0007', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0008', 'GVS-2027-0008', 'Aryan Srivastava', '2010-10-22', 'Male', 'class-10-a', 'Class 10', 'A', '7',
      'PAR0001', 'Mr. Chetan Srivastava', '9845010007', 'parent.gvs20270008@gmail.com', 'Mr. Chetan Srivastava', '9845010007', 'Government Officer',
      'Mrs. Vanya Srivastava', 'Homemaker / Professional', '#78, 3th Cross, Rajajinagar, Bengaluru - 560017', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4091 5119 1161', 'APAAR-KA-2026-900007', 'O+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0008', 'GVS-2027-0008', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aryan Srivastava', 'gvs-2027-0008@futureschool.edu', 'STUDENT', 'GVS-2027-0008', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0009', 'GVS-2027-0009', 'Avani Sen', '2010-01-01', 'Female', 'class-10-a', 'Class 10', 'A', '8',
      'PAR0001', 'Mr. Mayank Sen', '9845010008', 'parent.gvs20270009@gmail.com', 'Mr. Mayank Sen', '9845010008', 'Research Scientist',
      'Mrs. Bhavna Sen', 'Homemaker / Professional', '#89, 5th Cross, Basavanagudi, Bengaluru - 560018', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4104 5136 1184', 'APAAR-KA-2026-900008', 'A+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0009', 'GVS-2027-0009', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Avani Sen', 'gvs-2027-0009@futureschool.edu', 'STUDENT', 'GVS-2027-0009', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0010', 'GVS-2027-0010', 'Arjun Chawla', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '9',
      'PAR0001', 'Mr. Tarun Chawla', '9845010009', 'parent.gvs20270010@gmail.com', 'Mr. Tarun Chawla', '9845010009', 'Civil Engineer',
      'Mrs. Esha Chawla', 'Homemaker / Professional', '#1, 7th Cross, HSR Layout, Bengaluru - 560019', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4117 5153 1207', 'APAAR-KA-2026-900009', 'B+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0010', 'GVS-2027-0010', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Arjun Chawla', 'gvs-2027-0010@futureschool.edu', 'STUDENT', 'GVS-2027-0010', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0011', 'GVS-2027-0011', 'Diya Agarwal', '2010-07-15', 'Female', 'class-10-a', 'Class 10', 'A', '10',
      'PAR0001', 'Mr. Hemanth Agarwal', '9845010010', 'parent.gvs20270011@gmail.com', 'Mr. Hemanth Agarwal', '9845010010', 'Software Engineer',
      'Mrs. Ira Agarwal', 'Homemaker / Professional', '#12, 9th Cross, Malleshwaram, Bengaluru - 560020', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4130 5170 1230', 'APAAR-KA-2026-900010', 'AB+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0011', 'GVS-2027-0011', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Diya Agarwal', 'gvs-2027-0011@futureschool.edu', 'STUDENT', 'GVS-2027-0011', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0012', 'GVS-2027-0012', 'Deepak Yadav', '2010-10-22', 'Male', 'class-10-a', 'Class 10', 'A', '11',
      'PAR0001', 'Mr. Puneet Yadav', '9845010011', 'parent.gvs20270012@gmail.com', 'Mr. Puneet Yadav', '9845010011', 'Bank Officer',
      'Mrs. Lavanya Yadav', 'Homemaker / Professional', '#23, 11th Cross, Jayanagar, Bengaluru - 560021', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4143 5187 1253', 'APAAR-KA-2026-900011', 'O-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0012', 'GVS-2027-0012', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Deepak Yadav', 'gvs-2027-0012@futureschool.edu', 'STUDENT', 'GVS-2027-0012', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0013', 'GVS-2027-0013', 'Divya Poojary', '2010-01-01', 'Female', 'class-10-a', 'Class 10', 'A', '12',
      'PAR0001', 'Mr. Yashas Poojary', '9845010012', 'parent.gvs20270013@gmail.com', 'Mr. Yashas Poojary', '9845010012', 'Professor',
      'Mrs. Palak Poojary', 'Homemaker / Professional', '#34, 1th Cross, Rajajinagar, Bengaluru - 560022', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4156 5204 1276', 'APAAR-KA-2026-900012', 'A-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0013', 'GVS-2027-0013', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Divya Poojary', 'gvs-2027-0013@futureschool.edu', 'STUDENT', 'GVS-2027-0013', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0014', 'GVS-2027-0014', 'Devansh Mishra', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '13',
      'PAR0001', 'Mr. Harish Mishra', '9845010013', 'parent.gvs20270014@gmail.com', 'Mr. Harish Mishra', '9845010013', 'Physician',
      'Mrs. Trisha Mishra', 'Homemaker / Professional', '#45, 3th Cross, Basavanagudi, Bengaluru - 560023', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4169 5221 1299', 'APAAR-KA-2026-900013', 'B-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0014', 'GVS-2027-0014', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Devansh Mishra', 'gvs-2027-0014@futureschool.edu', 'STUDENT', 'GVS-2027-0014', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0015', 'GVS-2027-0015', 'Kavya Saxena', '2010-07-15', 'Female', 'class-10-a', 'Class 10', 'A', '14',
      'PAR0001', 'Mr. Pawan Saxena', '9845010014', 'parent.gvs20270015@gmail.com', 'Mr. Pawan Saxena', '9845010014', 'Architect',
      'Mrs. Yamini Saxena', 'Homemaker / Professional', '#56, 5th Cross, HSR Layout, Bengaluru - 560024', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4182 5238 1322', 'APAAR-KA-2026-900014', 'O+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0015', 'GVS-2027-0015', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kavya Saxena', 'gvs-2027-0015@futureschool.edu', 'STUDENT', 'GVS-2027-0015', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0016', 'GVS-2027-0016', 'Ishaan Patel', '2010-10-22', 'Male', 'class-10-a', 'Class 10', 'A', '15',
      'PAR0001', 'Mr. Yogesh Patel', '9845010015', 'parent.gvs20270016@gmail.com', 'Mr. Yogesh Patel', '9845010015', 'Chartered Accountant',
      'Mrs. Chhavi Patel', 'Homemaker / Professional', '#67, 7th Cross, Malleshwaram, Bengaluru - 560025', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4195 5255 1345', 'APAAR-KA-2026-900015', 'A+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0016', 'GVS-2027-0016', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ishaan Patel', 'gvs-2027-0016@futureschool.edu', 'STUDENT', 'GVS-2027-0016', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0017', 'GVS-2027-0017', 'Neha Hegde', '2010-01-01', 'Female', 'class-10-a', 'Class 10', 'A', '16',
      'PAR0001', 'Mr. Hitesh Hegde', '9845010016', 'parent.gvs20270017@gmail.com', 'Mr. Hitesh Hegde', '9845010016', 'Entrepreneur',
      'Mrs. Hema Hegde', 'Homemaker / Professional', '#78, 9th Cross, Jayanagar, Bengaluru - 560026', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4208 5272 1368', 'APAAR-KA-2026-900016', 'B+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0017', 'GVS-2027-0017', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Neha Hegde', 'gvs-2027-0017@futureschool.edu', 'STUDENT', 'GVS-2027-0017', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0018', 'GVS-2027-0018', 'Kabir Gokhale', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '17',
      'PAR0001', 'Mr. Prakash Gokhale', '9845010017', 'parent.gvs20270018@gmail.com', 'Mr. Prakash Gokhale', '9845010017', 'Government Officer',
      'Mrs. Keerthi Gokhale', 'Homemaker / Professional', '#89, 11th Cross, Rajajinagar, Bengaluru - 560027', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4221 5289 1391', 'APAAR-KA-2026-900017', 'AB+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0018', 'GVS-2027-0018', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kabir Gokhale', 'gvs-2027-0018@futureschool.edu', 'STUDENT', 'GVS-2027-0018', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0001', 'GVS-2027-0001', 'Aarav Sharma', '2010-07-15', 'Male', 'class-10-a', 'Class 10', 'A', '18',
      'PAR0001', 'Dr. Rajesh Sharma', '9876543210', 'rajesh.sharma@gmail.com', 'Dr. Rajesh Sharma', '9876543210', 'Research Scientist',
      'Mrs. Niharika Sharma', 'Homemaker / Professional', '#1, 1th Cross, Basavanagudi, Bengaluru - 560028', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4234 5306 1414', 'APAAR-KA-2026-900018', 'O-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0001', 'GVS-2027-0001', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aarav Sharma', 'gvs-2027-0001@futureschool.edu', 'STUDENT', 'GVS-2027-0001', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0019', 'GVS-2027-0019', 'Manish Rai', '2010-10-22', 'Male', 'class-10-a', 'Class 10', 'A', '19',
      'PAR0001', 'Mr. Deepak Rai', '9845010019', 'parent.gvs20270019@gmail.com', 'Mr. Deepak Rai', '9845010019', 'Civil Engineer',
      'Mrs. Sonal Rai', 'Homemaker / Professional', '#12, 3th Cross, HSR Layout, Bengaluru - 560029', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4247 5323 1437', 'APAAR-KA-2026-900019', 'A-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0019', 'GVS-2027-0019', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Manish Rai', 'gvs-2027-0019@futureschool.edu', 'STUDENT', 'GVS-2027-0019', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0020', 'GVS-2027-0020', 'Pooja Shastri', '2010-01-01', 'Female', 'class-10-a', 'Class 10', 'A', '20',
      'PAR0001', 'Mr. Rohan Shastri', '9845010020', 'parent.gvs20270020@gmail.com', 'Mr. Rohan Shastri', '9845010020', 'Software Engineer',
      'Mrs. Vinita Shastri', 'Homemaker / Professional', '#23, 5th Cross, Malleshwaram, Bengaluru - 560030', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4260 5340 1460', 'APAAR-KA-2026-900020', 'B-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0020', 'GVS-2027-0020', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Pooja Shastri', 'gvs-2027-0020@futureschool.edu', 'STUDENT', 'GVS-2027-0020', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0021', 'GVS-2027-0021', 'Rohan Pathak', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '21',
      'PAR0001', 'Mr. Dhruv Pathak', '9845010021', 'parent.gvs20270021@gmail.com', 'Mr. Dhruv Pathak', '9845010021', 'Bank Officer',
      'Mrs. Deepali Pathak', 'Homemaker / Professional', '#34, 7th Cross, Jayanagar, Bengaluru - 560031', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4273 5357 1483', 'APAAR-KA-2026-900021', 'O+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0021', 'GVS-2027-0021', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Rohan Pathak', 'gvs-2027-0021@futureschool.edu', 'STUDENT', 'GVS-2027-0021', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0022', 'GVS-2027-0022', 'Riya Reddy', '2010-07-15', 'Female', 'class-10-a', 'Class 10', 'A', '22',
      'PAR0001', 'Mr. Utkarsh Reddy', '9845010022', 'parent.gvs20270022@gmail.com', 'Mr. Utkarsh Reddy', '9845010022', 'Professor',
      'Mrs. Komal Reddy', 'Homemaker / Professional', '#45, 9th Cross, Rajajinagar, Bengaluru - 560032', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4286 5374 1506', 'APAAR-KA-2026-900022', 'A+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0022', 'GVS-2027-0022', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Riya Reddy', 'gvs-2027-0022@futureschool.edu', 'STUDENT', 'GVS-2027-0022', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0023', 'GVS-2027-0023', 'Siddharth Joshi', '2010-10-22', 'Male', 'class-10-a', 'Class 10', 'A', '23',
      'PAR0001', 'Mr. Kunal Joshi', '9845010023', 'parent.gvs20270023@gmail.com', 'Mr. Kunal Joshi', '9845010023', 'Physician',
      'Mrs. Parul Joshi', 'Homemaker / Professional', '#56, 11th Cross, Basavanagudi, Bengaluru - 560033', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4299 5391 1529', 'APAAR-KA-2026-900023', 'B+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0023', 'GVS-2027-0023', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Siddharth Joshi', 'gvs-2027-0023@futureschool.edu', 'STUDENT', 'GVS-2027-0023', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0024', 'GVS-2027-0024', 'Sneha Murthy', '2010-01-01', 'Female', 'class-10-a', 'Class 10', 'A', '24',
      'PAR0001', 'Mr. Sai Murthy', '9845010024', 'parent.gvs20270024@gmail.com', 'Mr. Sai Murthy', '9845010024', 'Architect',
      'Mrs. Tejaswi Murthy', 'Homemaker / Professional', '#67, 1th Cross, HSR Layout, Bengaluru - 560034', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4312 5408 1552', 'APAAR-KA-2026-900024', 'AB+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0024', 'GVS-2027-0024', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sneha Murthy', 'gvs-2027-0024@futureschool.edu', 'STUDENT', 'GVS-2027-0024', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0025', 'GVS-2027-0025', 'Varun Mukherjee', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '25',
      'PAR0001', 'Mr. Chetan Mukherjee', '9845010025', 'parent.gvs20270025@gmail.com', 'Mr. Chetan Mukherjee', '9845010025', 'Chartered Accountant',
      'Mrs. Chetna Mukherjee', 'Homemaker / Professional', '#78, 3th Cross, Malleshwaram, Bengaluru - 560035', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4325 5425 1575', 'APAAR-KA-2026-900025', 'O-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0025', 'GVS-2027-0025', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Varun Mukherjee', 'gvs-2027-0025@futureschool.edu', 'STUDENT', 'GVS-2027-0025', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0026', 'GVS-2027-0026', 'Tanvi Shetty', '2010-07-15', 'Female', 'class-10-a', 'Class 10', 'A', '26',
      'PAR0001', 'Mr. Mayank Shetty', '9845010026', 'parent.gvs20270026@gmail.com', 'Mr. Mayank Shetty', '9845010026', 'Entrepreneur',
      'Mrs. Indu Shetty', 'Homemaker / Professional', '#89, 5th Cross, Jayanagar, Bengaluru - 560036', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4338 5442 1598', 'APAAR-KA-2026-900026', 'A-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0026', 'GVS-2027-0026', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tanvi Shetty', 'gvs-2027-0026@futureschool.edu', 'STUDENT', 'GVS-2027-0026', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0027', 'GVS-2027-0027', 'Yash Pai', '2010-10-22', 'Male', 'class-10-a', 'Class 10', 'A', '27',
      'PAR0001', 'Mr. Tarun Pai', '9845010027', 'parent.gvs20270027@gmail.com', 'Mr. Tarun Pai', '9845010027', 'Government Officer',
      'Mrs. Malini Pai', 'Homemaker / Professional', '#1, 7th Cross, Rajajinagar, Bengaluru - 560037', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4351 5459 1621', 'APAAR-KA-2026-900027', 'B-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0027', 'GVS-2027-0027', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Yash Pai', 'gvs-2027-0027@futureschool.edu', 'STUDENT', 'GVS-2027-0027', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0028', 'GVS-2027-0028', 'Anika Tripathi', '2010-01-01', 'Female', 'class-10-a', 'Class 10', 'A', '28',
      'PAR0001', 'Mr. Hemanth Tripathi', '9845010028', 'parent.gvs20270028@gmail.com', 'Mr. Hemanth Tripathi', '9845010028', 'Research Scientist',
      'Mrs. Rupa Tripathi', 'Homemaker / Professional', '#12, 9th Cross, Basavanagudi, Bengaluru - 560038', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4364 5476 1644', 'APAAR-KA-2026-900028', 'O+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0028', 'GVS-2027-0028', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Anika Tripathi', 'gvs-2027-0028@futureschool.edu', 'STUDENT', 'GVS-2027-0028', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0029', 'GVS-2027-0029', 'Vihaan Deshmukh', '2010-04-08', 'Male', 'class-10-a', 'Class 10', 'A', '29',
      'PAR0001', 'Mr. Puneet Deshmukh', '9845010029', 'parent.gvs20270029@gmail.com', 'Mr. Puneet Deshmukh', '9845010029', 'Civil Engineer',
      'Mrs. Varsha Deshmukh', 'Homemaker / Professional', '#23, 11th Cross, HSR Layout, Bengaluru - 560039', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4377 5493 1667', 'APAAR-KA-2026-900029', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0029', 'GVS-2027-0029', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vihaan Deshmukh', 'gvs-2027-0029@futureschool.edu', 'STUDENT', 'GVS-2027-0029', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0030', 'GVS-2027-0030', 'Ishita Rao', '2010-07-15', 'Female', 'class-10-a', 'Class 10', 'A', '30',
      'PAR0001', 'Mr. Yashas Rao', '9845010030', 'parent.gvs20270030@gmail.com', 'Mr. Yashas Rao', '9845010030', 'Software Engineer',
      'Mrs. Aadhya Rao', 'Homemaker / Professional', '#34, 1th Cross, Malleshwaram, Bengaluru - 560040', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4390 5510 1690', 'APAAR-KA-2026-900030', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0030', 'GVS-2027-0030', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ishita Rao', 'gvs-2027-0030@futureschool.edu', 'STUDENT', 'GVS-2027-0030', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;

-- Students for Class 10-B (30 Students)
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0031', 'GVS-2027-0031', 'Dhruv Bhat', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '1',
      'PAR0001', 'Mr. Deepak Bhat', '9845010031', 'parent.gvs20270031@gmail.com', 'Mr. Deepak Bhat', '9845010031', 'Bank Officer',
      'Mrs. Avani Bhat', 'Homemaker / Professional', '#12, 3th Cross, Jayanagar, Bengaluru - 560011', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4013 5527 1023', 'APAAR-KA-2026-900031', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0031', 'GVS-2027-0031', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Dhruv Bhat', 'gvs-2027-0031@futureschool.edu', 'STUDENT', 'GVS-2027-0031', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0032', 'GVS-2027-0032', 'Meera Bose', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '2',
      'PAR0001', 'Mr. Rohan Bose', '9845010032', 'parent.gvs20270032@gmail.com', 'Mr. Rohan Bose', '9845010032', 'Professor',
      'Mrs. Kavya Bose', 'Homemaker / Professional', '#23, 5th Cross, Rajajinagar, Bengaluru - 560012', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4026 5544 1046', 'APAAR-KA-2026-900032', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0032', 'GVS-2027-0032', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Meera Bose', 'gvs-2027-0032@futureschool.edu', 'STUDENT', 'GVS-2027-0032', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0033', 'GVS-2027-0033', 'Pranav Nambiar', '2010-10-22', 'Male', 'class-10-b', 'Class 10', 'B', '3',
      'PAR0001', 'Mr. Dhruv Nambiar', '9845010033', 'parent.gvs20270033@gmail.com', 'Mr. Dhruv Nambiar', '9845010033', 'Physician',
      'Mrs. Riya Nambiar', 'Homemaker / Professional', '#34, 7th Cross, Basavanagudi, Bengaluru - 560013', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4039 5561 1069', 'APAAR-KA-2026-900033', 'AB+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0033', 'GVS-2027-0033', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Pranav Nambiar', 'gvs-2027-0033@futureschool.edu', 'STUDENT', 'GVS-2027-0033', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0034', 'GVS-2027-0034', 'Nandini Prabhu', '2010-01-01', 'Female', 'class-10-b', 'Class 10', 'B', '4',
      'PAR0001', 'Mr. Utkarsh Prabhu', '9845010034', 'parent.gvs20270034@gmail.com', 'Mr. Utkarsh Prabhu', '9845010034', 'Architect',
      'Mrs. Anika Prabhu', 'Homemaker / Professional', '#45, 9th Cross, HSR Layout, Bengaluru - 560014', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4052 5578 1092', 'APAAR-KA-2026-900034', 'O-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0034', 'GVS-2027-0034', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Nandini Prabhu', 'gvs-2027-0034@futureschool.edu', 'STUDENT', 'GVS-2027-0034', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0035', 'GVS-2027-0035', 'Ritvik Dubey', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '5',
      'PAR0001', 'Mr. Kunal Dubey', '9845010035', 'parent.gvs20270035@gmail.com', 'Mr. Kunal Dubey', '9845010035', 'Chartered Accountant',
      'Mrs. Nandini Dubey', 'Homemaker / Professional', '#56, 11th Cross, Malleshwaram, Bengaluru - 560015', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4065 5595 1115', 'APAAR-KA-2026-900035', 'A-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0035', 'GVS-2027-0035', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ritvik Dubey', 'gvs-2027-0035@futureschool.edu', 'STUDENT', 'GVS-2027-0035', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0036', 'GVS-2027-0036', 'Prisha Nair', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '6',
      'PAR0001', 'Mr. Sai Nair', '9845010036', 'parent.gvs20270036@gmail.com', 'Mr. Sai Nair', '9845010036', 'Entrepreneur',
      'Mrs. Saanvi Nair', 'Homemaker / Professional', '#67, 1th Cross, Jayanagar, Bengaluru - 560016', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4078 5612 1138', 'APAAR-KA-2026-900036', 'B-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0036', 'GVS-2027-0036', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Prisha Nair', 'gvs-2027-0036@futureschool.edu', 'STUDENT', 'GVS-2027-0036', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0037', 'GVS-2027-0037', 'Tanmay Pillai', '2010-10-22', 'Male', 'class-10-b', 'Class 10', 'B', '7',
      'PAR0001', 'Mr. Chetan Pillai', '9845010037', 'parent.gvs20270037@gmail.com', 'Mr. Chetan Pillai', '9845010037', 'Government Officer',
      'Mrs. Vanya Pillai', 'Homemaker / Professional', '#78, 3th Cross, Rajajinagar, Bengaluru - 560017', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4091 5629 1161', 'APAAR-KA-2026-900037', 'O+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0037', 'GVS-2027-0037', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tanmay Pillai', 'gvs-2027-0037@futureschool.edu', 'STUDENT', 'GVS-2027-0037', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0038', 'GVS-2027-0038', 'Riddhi Mehra', '2010-01-01', 'Female', 'class-10-b', 'Class 10', 'B', '8',
      'PAR0001', 'Mr. Mayank Mehra', '9845010038', 'parent.gvs20270038@gmail.com', 'Mr. Mayank Mehra', '9845010038', 'Research Scientist',
      'Mrs. Bhavna Mehra', 'Homemaker / Professional', '#89, 5th Cross, Basavanagudi, Bengaluru - 560018', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4104 5646 1184', 'APAAR-KA-2026-900038', 'A+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0038', 'GVS-2027-0038', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Riddhi Mehra', 'gvs-2027-0038@futureschool.edu', 'STUDENT', 'GVS-2027-0038', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0039', 'GVS-2027-0039', 'Nihal Banerjee', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '9',
      'PAR0001', 'Mr. Tarun Banerjee', '9845010039', 'parent.gvs20270039@gmail.com', 'Mr. Tarun Banerjee', '9845010039', 'Civil Engineer',
      'Mrs. Esha Banerjee', 'Homemaker / Professional', '#1, 7th Cross, HSR Layout, Bengaluru - 560019', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4117 5663 1207', 'APAAR-KA-2026-900039', 'B+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0039', 'GVS-2027-0039', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Nihal Banerjee', 'gvs-2027-0039@futureschool.edu', 'STUDENT', 'GVS-2027-0039', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0040', 'GVS-2027-0040', 'Saanvi Menon', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '10',
      'PAR0001', 'Mr. Hemanth Menon', '9845010040', 'parent.gvs20270040@gmail.com', 'Mr. Hemanth Menon', '9845010040', 'Software Engineer',
      'Mrs. Ira Menon', 'Homemaker / Professional', '#12, 9th Cross, Malleshwaram, Bengaluru - 560020', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4130 5680 1230', 'APAAR-KA-2026-900040', 'AB+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0040', 'GVS-2027-0040', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Saanvi Menon', 'gvs-2027-0040@futureschool.edu', 'STUDENT', 'GVS-2027-0040', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0041', 'GVS-2027-0041', 'Utkarsh Nayak', '2010-10-22', 'Male', 'class-10-b', 'Class 10', 'B', '11',
      'PAR0001', 'Mr. Puneet Nayak', '9845010041', 'parent.gvs20270041@gmail.com', 'Mr. Puneet Nayak', '9845010041', 'Bank Officer',
      'Mrs. Lavanya Nayak', 'Homemaker / Professional', '#23, 11th Cross, Jayanagar, Bengaluru - 560021', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4143 5697 1253', 'APAAR-KA-2026-900041', 'O-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0041', 'GVS-2027-0041', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Utkarsh Nayak', 'gvs-2027-0041@futureschool.edu', 'STUDENT', 'GVS-2027-0041', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0042', 'GVS-2027-0042', 'Shreya Shukla', '2010-01-01', 'Female', 'class-10-b', 'Class 10', 'B', '12',
      'PAR0001', 'Mr. Yashas Shukla', '9845010042', 'parent.gvs20270042@gmail.com', 'Mr. Yashas Shukla', '9845010042', 'Professor',
      'Mrs. Palak Shukla', 'Homemaker / Professional', '#34, 1th Cross, Rajajinagar, Bengaluru - 560022', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4156 5714 1276', 'APAAR-KA-2026-900042', 'A-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0042', 'GVS-2027-0042', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Shreya Shukla', 'gvs-2027-0042@futureschool.edu', 'STUDENT', 'GVS-2027-0042', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0043', 'GVS-2027-0043', 'Shaurya Verma', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '13',
      'PAR0001', 'Mr. Harish Verma', '9845010043', 'parent.gvs20270043@gmail.com', 'Mr. Harish Verma', '9845010043', 'Physician',
      'Mrs. Trisha Verma', 'Homemaker / Professional', '#45, 3th Cross, Basavanagudi, Bengaluru - 560023', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4169 5731 1299', 'APAAR-KA-2026-900043', 'B-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0043', 'GVS-2027-0043', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Shaurya Verma', 'gvs-2027-0043@futureschool.edu', 'STUDENT', 'GVS-2027-0043', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0044', 'GVS-2027-0044', 'Tara Kulkarni', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '14',
      'PAR0001', 'Mr. Pawan Kulkarni', '9845010044', 'parent.gvs20270044@gmail.com', 'Mr. Pawan Kulkarni', '9845010044', 'Architect',
      'Mrs. Yamini Kulkarni', 'Homemaker / Professional', '#56, 5th Cross, HSR Layout, Bengaluru - 560024', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4182 5748 1322', 'APAAR-KA-2026-900044', 'O+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0044', 'GVS-2027-0044', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tara Kulkarni', 'gvs-2027-0044@futureschool.edu', 'STUDENT', 'GVS-2027-0044', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0045', 'GVS-2027-0045', 'Tejas Kapoor', '2010-10-22', 'Male', 'class-10-b', 'Class 10', 'B', '15',
      'PAR0001', 'Mr. Yogesh Kapoor', '9845010045', 'parent.gvs20270045@gmail.com', 'Mr. Yogesh Kapoor', '9845010045', 'Chartered Accountant',
      'Mrs. Chhavi Kapoor', 'Homemaker / Professional', '#67, 7th Cross, Malleshwaram, Bengaluru - 560025', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4195 5765 1345', 'APAAR-KA-2026-900045', 'A+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0045', 'GVS-2027-0045', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tejas Kapoor', 'gvs-2027-0045@futureschool.edu', 'STUDENT', 'GVS-2027-0045', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0046', 'GVS-2027-0046', 'Vanya Chatterjee', '2010-01-01', 'Female', 'class-10-b', 'Class 10', 'B', '16',
      'PAR0001', 'Mr. Hitesh Chatterjee', '9845010046', 'parent.gvs20270046@gmail.com', 'Mr. Hitesh Chatterjee', '9845010046', 'Entrepreneur',
      'Mrs. Hema Chatterjee', 'Homemaker / Professional', '#78, 9th Cross, Jayanagar, Bengaluru - 560026', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4208 5782 1368', 'APAAR-KA-2026-900046', 'B+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0046', 'GVS-2027-0046', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vanya Chatterjee', 'gvs-2027-0046@futureschool.edu', 'STUDENT', 'GVS-2027-0046', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0047', 'GVS-2027-0047', 'Advait Rathore', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '17',
      'PAR0001', 'Mr. Prakash Rathore', '9845010047', 'parent.gvs20270047@gmail.com', 'Mr. Prakash Rathore', '9845010047', 'Government Officer',
      'Mrs. Keerthi Rathore', 'Homemaker / Professional', '#89, 11th Cross, Rajajinagar, Bengaluru - 560027', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4221 5799 1391', 'APAAR-KA-2026-900047', 'AB+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0047', 'GVS-2027-0047', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Advait Rathore', 'gvs-2027-0047@futureschool.edu', 'STUDENT', 'GVS-2027-0047', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0048', 'GVS-2027-0048', 'Yashvi Kamat', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '18',
      'PAR0001', 'Mr. Aarav Kamat', '9845010048', 'parent.gvs20270048@gmail.com', 'Mr. Aarav Kamat', '9845010048', 'Research Scientist',
      'Mrs. Niharika Kamat', 'Homemaker / Professional', '#1, 1th Cross, Basavanagudi, Bengaluru - 560028', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4234 5816 1414', 'APAAR-KA-2026-900048', 'O-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0048', 'GVS-2027-0048', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Yashvi Kamat', 'gvs-2027-0048@futureschool.edu', 'STUDENT', 'GVS-2027-0048', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0049', 'GVS-2027-0049', 'Harsh Tiwari', '2010-10-22', 'Male', 'class-10-b', 'Class 10', 'B', '19',
      'PAR0001', 'Mr. Deepak Tiwari', '9845010049', 'parent.gvs20270049@gmail.com', 'Mr. Deepak Tiwari', '9845010049', 'Civil Engineer',
      'Mrs. Sonal Tiwari', 'Homemaker / Professional', '#12, 3th Cross, HSR Layout, Bengaluru - 560029', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4247 5833 1437', 'APAAR-KA-2026-900049', 'A-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0049', 'GVS-2027-0049', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Harsh Tiwari', 'gvs-2027-0049@futureschool.edu', 'STUDENT', 'GVS-2027-0049', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0050', 'GVS-2027-0050', 'Aashi Sharma', '2010-01-01', 'Female', 'class-10-b', 'Class 10', 'B', '20',
      'PAR0001', 'Mr. Rohan Sharma', '9845010050', 'parent.gvs20270050@gmail.com', 'Mr. Rohan Sharma', '9845010050', 'Software Engineer',
      'Mrs. Vinita Sharma', 'Homemaker / Professional', '#23, 5th Cross, Malleshwaram, Bengaluru - 560030', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4260 5850 1460', 'APAAR-KA-2026-900050', 'B-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0050', 'GVS-2027-0050', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aashi Sharma', 'gvs-2027-0050@futureschool.edu', 'STUDENT', 'GVS-2027-0050', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0051', 'GVS-2027-0051', 'Kunal Iyer', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '21',
      'PAR0001', 'Mr. Dhruv Iyer', '9845010051', 'parent.gvs20270051@gmail.com', 'Mr. Dhruv Iyer', '9845010051', 'Bank Officer',
      'Mrs. Deepali Iyer', 'Homemaker / Professional', '#34, 7th Cross, Jayanagar, Bengaluru - 560031', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4273 5867 1483', 'APAAR-KA-2026-900051', 'O+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0051', 'GVS-2027-0051', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kunal Iyer', 'gvs-2027-0051@futureschool.edu', 'STUDENT', 'GVS-2027-0051', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0052', 'GVS-2027-0052', 'Bhavna Malhotra', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '22',
      'PAR0001', 'Mr. Utkarsh Malhotra', '9845010052', 'parent.gvs20270052@gmail.com', 'Mr. Utkarsh Malhotra', '9845010052', 'Professor',
      'Mrs. Komal Malhotra', 'Homemaker / Professional', '#45, 9th Cross, Rajajinagar, Bengaluru - 560032', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4286 5884 1506', 'APAAR-KA-2026-900052', 'A+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0052', 'GVS-2027-0052', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Bhavna Malhotra', 'gvs-2027-0052@futureschool.edu', 'STUDENT', 'GVS-2027-0052', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0053', 'GVS-2027-0053', 'Madhav Gupta', '2010-10-22', 'Male', 'class-10-b', 'Class 10', 'B', '23',
      'PAR0001', 'Mr. Kunal Gupta', '9845010053', 'parent.gvs20270053@gmail.com', 'Mr. Kunal Gupta', '9845010053', 'Physician',
      'Mrs. Parul Gupta', 'Homemaker / Professional', '#56, 11th Cross, Basavanagudi, Bengaluru - 560033', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4299 5901 1529', 'APAAR-KA-2026-900053', 'B+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0053', 'GVS-2027-0053', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Madhav Gupta', 'gvs-2027-0053@futureschool.edu', 'STUDENT', 'GVS-2027-0053', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0054', 'GVS-2027-0054', 'Charu Chauhan', '2010-01-01', 'Female', 'class-10-b', 'Class 10', 'B', '24',
      'PAR0001', 'Mr. Sai Chauhan', '9845010054', 'parent.gvs20270054@gmail.com', 'Mr. Sai Chauhan', '9845010054', 'Architect',
      'Mrs. Tejaswi Chauhan', 'Homemaker / Professional', '#67, 1th Cross, HSR Layout, Bengaluru - 560034', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4312 5918 1552', 'APAAR-KA-2026-900054', 'AB+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0054', 'GVS-2027-0054', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Charu Chauhan', 'gvs-2027-0054@futureschool.edu', 'STUDENT', 'GVS-2027-0054', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0055', 'GVS-2027-0055', 'Nakul Shenoy', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '25',
      'PAR0001', 'Mr. Chetan Shenoy', '9845010055', 'parent.gvs20270055@gmail.com', 'Mr. Chetan Shenoy', '9845010055', 'Chartered Accountant',
      'Mrs. Chetna Shenoy', 'Homemaker / Professional', '#78, 3th Cross, Malleshwaram, Bengaluru - 560035', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4325 5935 1575', 'APAAR-KA-2026-900055', 'O-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0055', 'GVS-2027-0055', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Nakul Shenoy', 'gvs-2027-0055@futureschool.edu', 'STUDENT', 'GVS-2027-0055', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0056', 'GVS-2027-0056', 'Drishti Pandey', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '26',
      'PAR0001', 'Mr. Mayank Pandey', '9845010056', 'parent.gvs20270056@gmail.com', 'Mr. Mayank Pandey', '9845010056', 'Entrepreneur',
      'Mrs. Indu Pandey', 'Homemaker / Professional', '#89, 5th Cross, Jayanagar, Bengaluru - 560036', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4338 5952 1598', 'APAAR-KA-2026-900056', 'A-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0056', 'GVS-2027-0056', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Drishti Pandey', 'gvs-2027-0056@futureschool.edu', 'STUDENT', 'GVS-2027-0056', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0057', 'GVS-2027-0057', 'Parth Srivastava', '2010-10-22', 'Male', 'class-10-b', 'Class 10', 'B', '27',
      'PAR0001', 'Mr. Tarun Srivastava', '9845010057', 'parent.gvs20270057@gmail.com', 'Mr. Tarun Srivastava', '9845010057', 'Government Officer',
      'Mrs. Malini Srivastava', 'Homemaker / Professional', '#1, 7th Cross, Rajajinagar, Bengaluru - 560037', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4351 5969 1621', 'APAAR-KA-2026-900057', 'B-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0057', 'GVS-2027-0057', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Parth Srivastava', 'gvs-2027-0057@futureschool.edu', 'STUDENT', 'GVS-2027-0057', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0058', 'GVS-2027-0058', 'Esha Sen', '2010-01-01', 'Female', 'class-10-b', 'Class 10', 'B', '28',
      'PAR0001', 'Mr. Hemanth Sen', '9845010058', 'parent.gvs20270058@gmail.com', 'Mr. Hemanth Sen', '9845010058', 'Research Scientist',
      'Mrs. Rupa Sen', 'Homemaker / Professional', '#12, 9th Cross, Basavanagudi, Bengaluru - 560038', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4364 5986 1644', 'APAAR-KA-2026-900058', 'O+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0058', 'GVS-2027-0058', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Esha Sen', 'gvs-2027-0058@futureschool.edu', 'STUDENT', 'GVS-2027-0058', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0059', 'GVS-2027-0059', 'Rishabh Chawla', '2010-04-08', 'Male', 'class-10-b', 'Class 10', 'B', '29',
      'PAR0001', 'Mr. Puneet Chawla', '9845010059', 'parent.gvs20270059@gmail.com', 'Mr. Puneet Chawla', '9845010059', 'Civil Engineer',
      'Mrs. Varsha Chawla', 'Homemaker / Professional', '#23, 11th Cross, HSR Layout, Bengaluru - 560039', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4377 6003 1667', 'APAAR-KA-2026-900059', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0059', 'GVS-2027-0059', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Rishabh Chawla', 'gvs-2027-0059@futureschool.edu', 'STUDENT', 'GVS-2027-0059', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0060', 'GVS-2027-0060', 'Garima Agarwal', '2010-07-15', 'Female', 'class-10-b', 'Class 10', 'B', '30',
      'PAR0001', 'Mr. Yashas Agarwal', '9845010060', 'parent.gvs20270060@gmail.com', 'Mr. Yashas Agarwal', '9845010060', 'Software Engineer',
      'Mrs. Aadhya Agarwal', 'Homemaker / Professional', '#34, 1th Cross, Malleshwaram, Bengaluru - 560040', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4390 6020 1690', 'APAAR-KA-2026-900060', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0060', 'GVS-2027-0060', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Garima Agarwal', 'gvs-2027-0060@futureschool.edu', 'STUDENT', 'GVS-2027-0060', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;

-- Students for Class 9-A (30 Students)
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0061', 'GVS-2027-0061', 'Sai Yadav', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '1',
      'PAR0001', 'Mr. Deepak Yadav', '9845010061', 'parent.gvs20270061@gmail.com', 'Mr. Deepak Yadav', '9845010061', 'Bank Officer',
      'Mrs. Avani Yadav', 'Homemaker / Professional', '#12, 3th Cross, Jayanagar, Bengaluru - 560011', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4013 6037 1023', 'APAAR-KA-2026-900061', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0061', 'GVS-2027-0061', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sai Yadav', 'gvs-2027-0061@futureschool.edu', 'STUDENT', 'GVS-2027-0061', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0062', 'GVS-2027-0062', 'Harini Poojary', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '2',
      'PAR0001', 'Mr. Rohan Poojary', '9845010062', 'parent.gvs20270062@gmail.com', 'Mr. Rohan Poojary', '9845010062', 'Professor',
      'Mrs. Kavya Poojary', 'Homemaker / Professional', '#23, 5th Cross, Rajajinagar, Bengaluru - 560012', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4026 6054 1046', 'APAAR-KA-2026-900062', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0062', 'GVS-2027-0062', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Harini Poojary', 'gvs-2027-0062@futureschool.edu', 'STUDENT', 'GVS-2027-0062', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0063', 'GVS-2027-0063', 'Tushar Mishra', '2011-10-22', 'Male', 'class-9-a', 'Class 9', 'A', '3',
      'PAR0001', 'Mr. Dhruv Mishra', '9845010063', 'parent.gvs20270063@gmail.com', 'Mr. Dhruv Mishra', '9845010063', 'Physician',
      'Mrs. Riya Mishra', 'Homemaker / Professional', '#34, 7th Cross, Basavanagudi, Bengaluru - 560013', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4039 6071 1069', 'APAAR-KA-2026-900063', 'AB+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0063', 'GVS-2027-0063', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tushar Mishra', 'gvs-2027-0063@futureschool.edu', 'STUDENT', 'GVS-2027-0063', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0064', 'GVS-2027-0064', 'Ira Saxena', '2011-01-01', 'Female', 'class-9-a', 'Class 9', 'A', '4',
      'PAR0001', 'Mr. Utkarsh Saxena', '9845010064', 'parent.gvs20270064@gmail.com', 'Mr. Utkarsh Saxena', '9845010064', 'Architect',
      'Mrs. Anika Saxena', 'Homemaker / Professional', '#45, 9th Cross, HSR Layout, Bengaluru - 560014', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4052 6088 1092', 'APAAR-KA-2026-900064', 'O-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0064', 'GVS-2027-0064', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ira Saxena', 'gvs-2027-0064@futureschool.edu', 'STUDENT', 'GVS-2027-0064', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0065', 'GVS-2027-0065', 'Vedant Patel', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '5',
      'PAR0001', 'Mr. Kunal Patel', '9845010065', 'parent.gvs20270065@gmail.com', 'Mr. Kunal Patel', '9845010065', 'Chartered Accountant',
      'Mrs. Nandini Patel', 'Homemaker / Professional', '#56, 11th Cross, Malleshwaram, Bengaluru - 560015', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4065 6105 1115', 'APAAR-KA-2026-900065', 'A-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0065', 'GVS-2027-0065', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vedant Patel', 'gvs-2027-0065@futureschool.edu', 'STUDENT', 'GVS-2027-0065', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0066', 'GVS-2027-0066', 'Jhanvi Hegde', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '6',
      'PAR0001', 'Mr. Sai Hegde', '9845010066', 'parent.gvs20270066@gmail.com', 'Mr. Sai Hegde', '9845010066', 'Entrepreneur',
      'Mrs. Saanvi Hegde', 'Homemaker / Professional', '#67, 1th Cross, Jayanagar, Bengaluru - 560016', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4078 6122 1138', 'APAAR-KA-2026-900066', 'B-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0066', 'GVS-2027-0066', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Jhanvi Hegde', 'gvs-2027-0066@futureschool.edu', 'STUDENT', 'GVS-2027-0066', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0067', 'GVS-2027-0067', 'Yuvan Gokhale', '2011-10-22', 'Male', 'class-9-a', 'Class 9', 'A', '7',
      'PAR0001', 'Mr. Chetan Gokhale', '9845010067', 'parent.gvs20270067@gmail.com', 'Mr. Chetan Gokhale', '9845010067', 'Government Officer',
      'Mrs. Vanya Gokhale', 'Homemaker / Professional', '#78, 3th Cross, Rajajinagar, Bengaluru - 560017', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4091 6139 1161', 'APAAR-KA-2026-900067', 'O+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0067', 'GVS-2027-0067', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Yuvan Gokhale', 'gvs-2027-0067@futureschool.edu', 'STUDENT', 'GVS-2027-0067', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0068', 'GVS-2027-0068', 'Kriti Singh', '2011-01-01', 'Female', 'class-9-a', 'Class 9', 'A', '8',
      'PAR0001', 'Mr. Mayank Singh', '9845010068', 'parent.gvs20270068@gmail.com', 'Mr. Mayank Singh', '9845010068', 'Research Scientist',
      'Mrs. Bhavna Singh', 'Homemaker / Professional', '#89, 5th Cross, Basavanagudi, Bengaluru - 560018', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4104 6156 1184', 'APAAR-KA-2026-900068', 'A+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0068', 'GVS-2027-0068', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kriti Singh', 'gvs-2027-0068@futureschool.edu', 'STUDENT', 'GVS-2027-0068', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0069', 'GVS-2027-0069', 'Anirudh Rai', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '9',
      'PAR0001', 'Mr. Tarun Rai', '9845010069', 'parent.gvs20270069@gmail.com', 'Mr. Tarun Rai', '9845010069', 'Civil Engineer',
      'Mrs. Esha Rai', 'Homemaker / Professional', '#1, 7th Cross, HSR Layout, Bengaluru - 560019', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4117 6173 1207', 'APAAR-KA-2026-900069', 'B+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0069', 'GVS-2027-0069', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Anirudh Rai', 'gvs-2027-0069@futureschool.edu', 'STUDENT', 'GVS-2027-0069', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0070', 'GVS-2027-0070', 'Lavanya Shastri', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '10',
      'PAR0001', 'Mr. Hemanth Shastri', '9845010070', 'parent.gvs20270070@gmail.com', 'Mr. Hemanth Shastri', '9845010070', 'Software Engineer',
      'Mrs. Ira Shastri', 'Homemaker / Professional', '#12, 9th Cross, Malleshwaram, Bengaluru - 560020', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4130 6190 1230', 'APAAR-KA-2026-900070', 'AB+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0070', 'GVS-2027-0070', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Lavanya Shastri', 'gvs-2027-0070@futureschool.edu', 'STUDENT', 'GVS-2027-0070', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0071', 'GVS-2027-0071', 'Chetan Pathak', '2011-10-22', 'Male', 'class-9-a', 'Class 9', 'A', '11',
      'PAR0001', 'Mr. Puneet Pathak', '9845010071', 'parent.gvs20270071@gmail.com', 'Mr. Puneet Pathak', '9845010071', 'Bank Officer',
      'Mrs. Lavanya Pathak', 'Homemaker / Professional', '#23, 11th Cross, Jayanagar, Bengaluru - 560021', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4143 6207 1253', 'APAAR-KA-2026-900071', 'O-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0071', 'GVS-2027-0071', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Chetan Pathak', 'gvs-2027-0071@futureschool.edu', 'STUDENT', 'GVS-2027-0071', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0072', 'GVS-2027-0072', 'Mansi Reddy', '2011-01-01', 'Female', 'class-9-a', 'Class 9', 'A', '12',
      'PAR0001', 'Mr. Yashas Reddy', '9845010072', 'parent.gvs20270072@gmail.com', 'Mr. Yashas Reddy', '9845010072', 'Professor',
      'Mrs. Palak Reddy', 'Homemaker / Professional', '#34, 1th Cross, Rajajinagar, Bengaluru - 560022', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4156 6224 1276', 'APAAR-KA-2026-900072', 'A-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0072', 'GVS-2027-0072', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mansi Reddy', 'gvs-2027-0072@futureschool.edu', 'STUDENT', 'GVS-2027-0072', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0073', 'GVS-2027-0073', 'Dhanush Joshi', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '13',
      'PAR0001', 'Mr. Harish Joshi', '9845010073', 'parent.gvs20270073@gmail.com', 'Mr. Harish Joshi', '9845010073', 'Physician',
      'Mrs. Trisha Joshi', 'Homemaker / Professional', '#45, 3th Cross, Basavanagudi, Bengaluru - 560023', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4169 6241 1299', 'APAAR-KA-2026-900073', 'B-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0073', 'GVS-2027-0073', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Dhanush Joshi', 'gvs-2027-0073@futureschool.edu', 'STUDENT', 'GVS-2027-0073', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0074', 'GVS-2027-0074', 'Navya Murthy', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '14',
      'PAR0001', 'Mr. Pawan Murthy', '9845010074', 'parent.gvs20270074@gmail.com', 'Mr. Pawan Murthy', '9845010074', 'Architect',
      'Mrs. Yamini Murthy', 'Homemaker / Professional', '#56, 5th Cross, HSR Layout, Bengaluru - 560024', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4182 6258 1322', 'APAAR-KA-2026-900074', 'O+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0074', 'GVS-2027-0074', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Navya Murthy', 'gvs-2027-0074@futureschool.edu', 'STUDENT', 'GVS-2027-0074', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0075', 'GVS-2027-0075', 'Gaurav Mukherjee', '2011-10-22', 'Male', 'class-9-a', 'Class 9', 'A', '15',
      'PAR0001', 'Mr. Yogesh Mukherjee', '9845010075', 'parent.gvs20270075@gmail.com', 'Mr. Yogesh Mukherjee', '9845010075', 'Chartered Accountant',
      'Mrs. Chhavi Mukherjee', 'Homemaker / Professional', '#67, 7th Cross, Malleshwaram, Bengaluru - 560025', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4195 6275 1345', 'APAAR-KA-2026-900075', 'A+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0075', 'GVS-2027-0075', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Gaurav Mukherjee', 'gvs-2027-0075@futureschool.edu', 'STUDENT', 'GVS-2027-0075', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0076', 'GVS-2027-0076', 'Palak Shetty', '2011-01-01', 'Female', 'class-9-a', 'Class 9', 'A', '16',
      'PAR0001', 'Mr. Hitesh Shetty', '9845010076', 'parent.gvs20270076@gmail.com', 'Mr. Hitesh Shetty', '9845010076', 'Entrepreneur',
      'Mrs. Hema Shetty', 'Homemaker / Professional', '#78, 9th Cross, Jayanagar, Bengaluru - 560026', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4208 6292 1368', 'APAAR-KA-2026-900076', 'B+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0076', 'GVS-2027-0076', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Palak Shetty', 'gvs-2027-0076@futureschool.edu', 'STUDENT', 'GVS-2027-0076', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0077', 'GVS-2027-0077', 'Hemant Pai', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '17',
      'PAR0001', 'Mr. Prakash Pai', '9845010077', 'parent.gvs20270077@gmail.com', 'Mr. Prakash Pai', '9845010077', 'Government Officer',
      'Mrs. Keerthi Pai', 'Homemaker / Professional', '#89, 11th Cross, Rajajinagar, Bengaluru - 560027', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4221 6309 1391', 'APAAR-KA-2026-900077', 'AB+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0077', 'GVS-2027-0077', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Hemant Pai', 'gvs-2027-0077@futureschool.edu', 'STUDENT', 'GVS-2027-0077', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0078', 'GVS-2027-0078', 'Radhika Tripathi', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '18',
      'PAR0001', 'Mr. Aarav Tripathi', '9845010078', 'parent.gvs20270078@gmail.com', 'Mr. Aarav Tripathi', '9845010078', 'Research Scientist',
      'Mrs. Niharika Tripathi', 'Homemaker / Professional', '#1, 1th Cross, Basavanagudi, Bengaluru - 560028', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4234 6326 1414', 'APAAR-KA-2026-900078', 'O-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0078', 'GVS-2027-0078', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Radhika Tripathi', 'gvs-2027-0078@futureschool.edu', 'STUDENT', 'GVS-2027-0078', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0079', 'GVS-2027-0079', 'Jayant Deshmukh', '2011-10-22', 'Male', 'class-9-a', 'Class 9', 'A', '19',
      'PAR0001', 'Mr. Deepak Deshmukh', '9845010079', 'parent.gvs20270079@gmail.com', 'Mr. Deepak Deshmukh', '9845010079', 'Civil Engineer',
      'Mrs. Sonal Deshmukh', 'Homemaker / Professional', '#12, 3th Cross, HSR Layout, Bengaluru - 560029', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4247 6343 1437', 'APAAR-KA-2026-900079', 'A-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0079', 'GVS-2027-0079', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Jayant Deshmukh', 'gvs-2027-0079@futureschool.edu', 'STUDENT', 'GVS-2027-0079', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0080', 'GVS-2027-0080', 'Sakshi Rao', '2011-01-01', 'Female', 'class-9-a', 'Class 9', 'A', '20',
      'PAR0001', 'Mr. Rohan Rao', '9845010080', 'parent.gvs20270080@gmail.com', 'Mr. Rohan Rao', '9845010080', 'Software Engineer',
      'Mrs. Vinita Rao', 'Homemaker / Professional', '#23, 5th Cross, Malleshwaram, Bengaluru - 560030', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4260 6360 1460', 'APAAR-KA-2026-900080', 'B-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0080', 'GVS-2027-0080', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sakshi Rao', 'gvs-2027-0080@futureschool.edu', 'STUDENT', 'GVS-2027-0080', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0081', 'GVS-2027-0081', 'Mayank Bhat', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '21',
      'PAR0001', 'Mr. Dhruv Bhat', '9845010081', 'parent.gvs20270081@gmail.com', 'Mr. Dhruv Bhat', '9845010081', 'Bank Officer',
      'Mrs. Deepali Bhat', 'Homemaker / Professional', '#34, 7th Cross, Jayanagar, Bengaluru - 560031', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4273 6377 1483', 'APAAR-KA-2026-900081', 'O+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0081', 'GVS-2027-0081', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mayank Bhat', 'gvs-2027-0081@futureschool.edu', 'STUDENT', 'GVS-2027-0081', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0082', 'GVS-2027-0082', 'Trisha Bose', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '22',
      'PAR0001', 'Mr. Utkarsh Bose', '9845010082', 'parent.gvs20270082@gmail.com', 'Mr. Utkarsh Bose', '9845010082', 'Professor',
      'Mrs. Komal Bose', 'Homemaker / Professional', '#45, 9th Cross, Rajajinagar, Bengaluru - 560032', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4286 6394 1506', 'APAAR-KA-2026-900082', 'A+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0082', 'GVS-2027-0082', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Trisha Bose', 'gvs-2027-0082@futureschool.edu', 'STUDENT', 'GVS-2027-0082', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0083', 'GVS-2027-0083', 'Naveen Nambiar', '2011-10-22', 'Male', 'class-9-a', 'Class 9', 'A', '23',
      'PAR0001', 'Mr. Kunal Nambiar', '9845010083', 'parent.gvs20270083@gmail.com', 'Mr. Kunal Nambiar', '9845010083', 'Physician',
      'Mrs. Parul Nambiar', 'Homemaker / Professional', '#56, 11th Cross, Basavanagudi, Bengaluru - 560033', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4299 6411 1529', 'APAAR-KA-2026-900083', 'B+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0083', 'GVS-2027-0083', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Naveen Nambiar', 'gvs-2027-0083@futureschool.edu', 'STUDENT', 'GVS-2027-0083', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0084', 'GVS-2027-0084', 'Urvi Prabhu', '2011-01-01', 'Female', 'class-9-a', 'Class 9', 'A', '24',
      'PAR0001', 'Mr. Sai Prabhu', '9845010084', 'parent.gvs20270084@gmail.com', 'Mr. Sai Prabhu', '9845010084', 'Architect',
      'Mrs. Tejaswi Prabhu', 'Homemaker / Professional', '#67, 1th Cross, HSR Layout, Bengaluru - 560034', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4312 6428 1552', 'APAAR-KA-2026-900084', 'AB+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0084', 'GVS-2027-0084', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Urvi Prabhu', 'gvs-2027-0084@futureschool.edu', 'STUDENT', 'GVS-2027-0084', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0085', 'GVS-2027-0085', 'Piyush Dubey', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '25',
      'PAR0001', 'Mr. Chetan Dubey', '9845010085', 'parent.gvs20270085@gmail.com', 'Mr. Chetan Dubey', '9845010085', 'Chartered Accountant',
      'Mrs. Chetna Dubey', 'Homemaker / Professional', '#78, 3th Cross, Malleshwaram, Bengaluru - 560035', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4325 6445 1575', 'APAAR-KA-2026-900085', 'O-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0085', 'GVS-2027-0085', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Piyush Dubey', 'gvs-2027-0085@futureschool.edu', 'STUDENT', 'GVS-2027-0085', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0086', 'GVS-2027-0086', 'Vidhi Nair', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '26',
      'PAR0001', 'Mr. Mayank Nair', '9845010086', 'parent.gvs20270086@gmail.com', 'Mr. Mayank Nair', '9845010086', 'Entrepreneur',
      'Mrs. Indu Nair', 'Homemaker / Professional', '#89, 5th Cross, Jayanagar, Bengaluru - 560036', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4338 6462 1598', 'APAAR-KA-2026-900086', 'A-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0086', 'GVS-2027-0086', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vidhi Nair', 'gvs-2027-0086@futureschool.edu', 'STUDENT', 'GVS-2027-0086', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0087', 'GVS-2027-0087', 'Raghav Pillai', '2011-10-22', 'Male', 'class-9-a', 'Class 9', 'A', '27',
      'PAR0001', 'Mr. Tarun Pillai', '9845010087', 'parent.gvs20270087@gmail.com', 'Mr. Tarun Pillai', '9845010087', 'Government Officer',
      'Mrs. Malini Pillai', 'Homemaker / Professional', '#1, 7th Cross, Rajajinagar, Bengaluru - 560037', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4351 6479 1621', 'APAAR-KA-2026-900087', 'B-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0087', 'GVS-2027-0087', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Raghav Pillai', 'gvs-2027-0087@futureschool.edu', 'STUDENT', 'GVS-2027-0087', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0088', 'GVS-2027-0088', 'Yamini Mehra', '2011-01-01', 'Female', 'class-9-a', 'Class 9', 'A', '28',
      'PAR0001', 'Mr. Hemanth Mehra', '9845010088', 'parent.gvs20270088@gmail.com', 'Mr. Hemanth Mehra', '9845010088', 'Research Scientist',
      'Mrs. Rupa Mehra', 'Homemaker / Professional', '#12, 9th Cross, Basavanagudi, Bengaluru - 560038', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4364 6496 1644', 'APAAR-KA-2026-900088', 'O+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0088', 'GVS-2027-0088', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Yamini Mehra', 'gvs-2027-0088@futureschool.edu', 'STUDENT', 'GVS-2027-0088', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0089', 'GVS-2027-0089', 'Samir Banerjee', '2011-04-08', 'Male', 'class-9-a', 'Class 9', 'A', '29',
      'PAR0001', 'Mr. Puneet Banerjee', '9845010089', 'parent.gvs20270089@gmail.com', 'Mr. Puneet Banerjee', '9845010089', 'Civil Engineer',
      'Mrs. Varsha Banerjee', 'Homemaker / Professional', '#23, 11th Cross, HSR Layout, Bengaluru - 560039', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4377 6513 1667', 'APAAR-KA-2026-900089', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0089', 'GVS-2027-0089', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Samir Banerjee', 'gvs-2027-0089@futureschool.edu', 'STUDENT', 'GVS-2027-0089', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0090', 'GVS-2027-0090', 'Akshara Menon', '2011-07-15', 'Female', 'class-9-a', 'Class 9', 'A', '30',
      'PAR0001', 'Mr. Yashas Menon', '9845010090', 'parent.gvs20270090@gmail.com', 'Mr. Yashas Menon', '9845010090', 'Software Engineer',
      'Mrs. Aadhya Menon', 'Homemaker / Professional', '#34, 1th Cross, Malleshwaram, Bengaluru - 560040', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4390 6530 1690', 'APAAR-KA-2026-900090', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0090', 'GVS-2027-0090', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Akshara Menon', 'gvs-2027-0090@futureschool.edu', 'STUDENT', 'GVS-2027-0090', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;

-- Students for Class 9-B (30 Students)
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0091', 'GVS-2027-0091', 'Tarun Nayak', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '1',
      'PAR0001', 'Mr. Deepak Nayak', '9845010091', 'parent.gvs20270091@gmail.com', 'Mr. Deepak Nayak', '9845010091', 'Bank Officer',
      'Mrs. Avani Nayak', 'Homemaker / Professional', '#12, 3th Cross, Jayanagar, Bengaluru - 560011', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4013 6547 1023', 'APAAR-KA-2026-900091', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0091', 'GVS-2027-0091', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tarun Nayak', 'gvs-2027-0091@futureschool.edu', 'STUDENT', 'GVS-2027-0091', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0092', 'GVS-2027-0092', 'Bhumi Shukla', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '2',
      'PAR0001', 'Mr. Rohan Shukla', '9845010092', 'parent.gvs20270092@gmail.com', 'Mr. Rohan Shukla', '9845010092', 'Professor',
      'Mrs. Kavya Shukla', 'Homemaker / Professional', '#23, 5th Cross, Rajajinagar, Bengaluru - 560012', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4026 6564 1046', 'APAAR-KA-2026-900092', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0092', 'GVS-2027-0092', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Bhumi Shukla', 'gvs-2027-0092@futureschool.edu', 'STUDENT', 'GVS-2027-0092', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0093', 'GVS-2027-0093', 'Ayush Verma', '2011-10-22', 'Male', 'class-9-b', 'Class 9', 'B', '3',
      'PAR0001', 'Mr. Dhruv Verma', '9845010093', 'parent.gvs20270093@gmail.com', 'Mr. Dhruv Verma', '9845010093', 'Physician',
      'Mrs. Riya Verma', 'Homemaker / Professional', '#34, 7th Cross, Basavanagudi, Bengaluru - 560013', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4039 6581 1069', 'APAAR-KA-2026-900093', 'AB+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0093', 'GVS-2027-0093', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ayush Verma', 'gvs-2027-0093@futureschool.edu', 'STUDENT', 'GVS-2027-0093', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0094', 'GVS-2027-0094', 'Chhavi Kulkarni', '2011-01-01', 'Female', 'class-9-b', 'Class 9', 'B', '4',
      'PAR0001', 'Mr. Utkarsh Kulkarni', '9845010094', 'parent.gvs20270094@gmail.com', 'Mr. Utkarsh Kulkarni', '9845010094', 'Architect',
      'Mrs. Anika Kulkarni', 'Homemaker / Professional', '#45, 9th Cross, HSR Layout, Bengaluru - 560014', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4052 6598 1092', 'APAAR-KA-2026-900094', 'O-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0094', 'GVS-2027-0094', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Chhavi Kulkarni', 'gvs-2027-0094@futureschool.edu', 'STUDENT', 'GVS-2027-0094', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0095', 'GVS-2027-0095', 'Chinmay Kapoor', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '5',
      'PAR0001', 'Mr. Kunal Kapoor', '9845010095', 'parent.gvs20270095@gmail.com', 'Mr. Kunal Kapoor', '9845010095', 'Chartered Accountant',
      'Mrs. Nandini Kapoor', 'Homemaker / Professional', '#56, 11th Cross, Malleshwaram, Bengaluru - 560015', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4065 6615 1115', 'APAAR-KA-2026-900095', 'A-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0095', 'GVS-2027-0095', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Chinmay Kapoor', 'gvs-2027-0095@futureschool.edu', 'STUDENT', 'GVS-2027-0095', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0096', 'GVS-2027-0096', 'Damini Chatterjee', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '6',
      'PAR0001', 'Mr. Sai Chatterjee', '9845010096', 'parent.gvs20270096@gmail.com', 'Mr. Sai Chatterjee', '9845010096', 'Entrepreneur',
      'Mrs. Saanvi Chatterjee', 'Homemaker / Professional', '#67, 1th Cross, Jayanagar, Bengaluru - 560016', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4078 6632 1138', 'APAAR-KA-2026-900096', 'B-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0096', 'GVS-2027-0096', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Damini Chatterjee', 'gvs-2027-0096@futureschool.edu', 'STUDENT', 'GVS-2027-0096', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0097', 'GVS-2027-0097', 'Darshan Rathore', '2011-10-22', 'Male', 'class-9-b', 'Class 9', 'B', '7',
      'PAR0001', 'Mr. Chetan Rathore', '9845010097', 'parent.gvs20270097@gmail.com', 'Mr. Chetan Rathore', '9845010097', 'Government Officer',
      'Mrs. Vanya Rathore', 'Homemaker / Professional', '#78, 3th Cross, Rajajinagar, Bengaluru - 560017', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4091 6649 1161', 'APAAR-KA-2026-900097', 'O+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0097', 'GVS-2027-0097', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Darshan Rathore', 'gvs-2027-0097@futureschool.edu', 'STUDENT', 'GVS-2027-0097', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0098', 'GVS-2027-0098', 'Gargi Kamat', '2011-01-01', 'Female', 'class-9-b', 'Class 9', 'B', '8',
      'PAR0001', 'Mr. Mayank Kamat', '9845010098', 'parent.gvs20270098@gmail.com', 'Mr. Mayank Kamat', '9845010098', 'Research Scientist',
      'Mrs. Bhavna Kamat', 'Homemaker / Professional', '#89, 5th Cross, Basavanagudi, Bengaluru - 560018', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4104 6666 1184', 'APAAR-KA-2026-900098', 'A+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0098', 'GVS-2027-0098', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Gargi Kamat', 'gvs-2027-0098@futureschool.edu', 'STUDENT', 'GVS-2027-0098', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0099', 'GVS-2027-0099', 'Girish Tiwari', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '9',
      'PAR0001', 'Mr. Tarun Tiwari', '9845010099', 'parent.gvs20270099@gmail.com', 'Mr. Tarun Tiwari', '9845010099', 'Civil Engineer',
      'Mrs. Esha Tiwari', 'Homemaker / Professional', '#1, 7th Cross, HSR Layout, Bengaluru - 560019', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4117 6683 1207', 'APAAR-KA-2026-900099', 'B+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0099', 'GVS-2027-0099', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Girish Tiwari', 'gvs-2027-0099@futureschool.edu', 'STUDENT', 'GVS-2027-0099', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0100', 'GVS-2027-0100', 'Hema Sharma', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '10',
      'PAR0001', 'Mr. Hemanth Sharma', '9845010100', 'parent.gvs20270100@gmail.com', 'Mr. Hemanth Sharma', '9845010100', 'Software Engineer',
      'Mrs. Ira Sharma', 'Homemaker / Professional', '#12, 9th Cross, Malleshwaram, Bengaluru - 560020', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4130 6700 1230', 'APAAR-KA-2026-900100', 'AB+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0100', 'GVS-2027-0100', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Hema Sharma', 'gvs-2027-0100@futureschool.edu', 'STUDENT', 'GVS-2027-0100', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0101', 'GVS-2027-0101', 'Hemanth Iyer', '2011-10-22', 'Male', 'class-9-b', 'Class 9', 'B', '11',
      'PAR0001', 'Mr. Puneet Iyer', '9845010101', 'parent.gvs20270101@gmail.com', 'Mr. Puneet Iyer', '9845010101', 'Bank Officer',
      'Mrs. Lavanya Iyer', 'Homemaker / Professional', '#23, 11th Cross, Jayanagar, Bengaluru - 560021', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4143 6717 1253', 'APAAR-KA-2026-900101', 'O-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0101', 'GVS-2027-0101', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Hemanth Iyer', 'gvs-2027-0101@futureschool.edu', 'STUDENT', 'GVS-2027-0101', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0102', 'GVS-2027-0102', 'Ipsita Malhotra', '2011-01-01', 'Female', 'class-9-b', 'Class 9', 'B', '12',
      'PAR0001', 'Mr. Yashas Malhotra', '9845010102', 'parent.gvs20270102@gmail.com', 'Mr. Yashas Malhotra', '9845010102', 'Professor',
      'Mrs. Palak Malhotra', 'Homemaker / Professional', '#34, 1th Cross, Rajajinagar, Bengaluru - 560022', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4156 6734 1276', 'APAAR-KA-2026-900102', 'A-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0102', 'GVS-2027-0102', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ipsita Malhotra', 'gvs-2027-0102@futureschool.edu', 'STUDENT', 'GVS-2027-0102', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0103', 'GVS-2027-0103', 'Kaushik Gupta', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '13',
      'PAR0001', 'Mr. Harish Gupta', '9845010103', 'parent.gvs20270103@gmail.com', 'Mr. Harish Gupta', '9845010103', 'Physician',
      'Mrs. Trisha Gupta', 'Homemaker / Professional', '#45, 3th Cross, Basavanagudi, Bengaluru - 560023', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4169 6751 1299', 'APAAR-KA-2026-900103', 'B-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0103', 'GVS-2027-0103', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kaushik Gupta', 'gvs-2027-0103@futureschool.edu', 'STUDENT', 'GVS-2027-0103', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0104', 'GVS-2027-0104', 'Jyoti Chauhan', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '14',
      'PAR0001', 'Mr. Pawan Chauhan', '9845010104', 'parent.gvs20270104@gmail.com', 'Mr. Pawan Chauhan', '9845010104', 'Architect',
      'Mrs. Yamini Chauhan', 'Homemaker / Professional', '#56, 5th Cross, HSR Layout, Bengaluru - 560024', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4182 6768 1322', 'APAAR-KA-2026-900104', 'O+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0104', 'GVS-2027-0104', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Jyoti Chauhan', 'gvs-2027-0104@futureschool.edu', 'STUDENT', 'GVS-2027-0104', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0105', 'GVS-2027-0105', 'Lakshya Shenoy', '2011-10-22', 'Male', 'class-9-b', 'Class 9', 'B', '15',
      'PAR0001', 'Mr. Yogesh Shenoy', '9845010105', 'parent.gvs20270105@gmail.com', 'Mr. Yogesh Shenoy', '9845010105', 'Chartered Accountant',
      'Mrs. Chhavi Shenoy', 'Homemaker / Professional', '#67, 7th Cross, Malleshwaram, Bengaluru - 560025', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4195 6785 1345', 'APAAR-KA-2026-900105', 'A+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0105', 'GVS-2027-0105', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Lakshya Shenoy', 'gvs-2027-0105@futureschool.edu', 'STUDENT', 'GVS-2027-0105', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0106', 'GVS-2027-0106', 'Keerthi Pandey', '2011-01-01', 'Female', 'class-9-b', 'Class 9', 'B', '16',
      'PAR0001', 'Mr. Hitesh Pandey', '9845010106', 'parent.gvs20270106@gmail.com', 'Mr. Hitesh Pandey', '9845010106', 'Entrepreneur',
      'Mrs. Hema Pandey', 'Homemaker / Professional', '#78, 9th Cross, Jayanagar, Bengaluru - 560026', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4208 6802 1368', 'APAAR-KA-2026-900106', 'B+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0106', 'GVS-2027-0106', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Keerthi Pandey', 'gvs-2027-0106@futureschool.edu', 'STUDENT', 'GVS-2027-0106', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0107', 'GVS-2027-0107', 'Manoj Srivastava', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '17',
      'PAR0001', 'Mr. Prakash Srivastava', '9845010107', 'parent.gvs20270107@gmail.com', 'Mr. Prakash Srivastava', '9845010107', 'Government Officer',
      'Mrs. Keerthi Srivastava', 'Homemaker / Professional', '#89, 11th Cross, Rajajinagar, Bengaluru - 560027', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4221 6819 1391', 'APAAR-KA-2026-900107', 'AB+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0107', 'GVS-2027-0107', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Manoj Srivastava', 'gvs-2027-0107@futureschool.edu', 'STUDENT', 'GVS-2027-0107', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0108', 'GVS-2027-0108', 'Lipika Sen', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '18',
      'PAR0001', 'Mr. Aarav Sen', '9845010108', 'parent.gvs20270108@gmail.com', 'Mr. Aarav Sen', '9845010108', 'Research Scientist',
      'Mrs. Niharika Sen', 'Homemaker / Professional', '#1, 1th Cross, Basavanagudi, Bengaluru - 560028', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4234 6836 1414', 'APAAR-KA-2026-900108', 'O-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0108', 'GVS-2027-0108', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Lipika Sen', 'gvs-2027-0108@futureschool.edu', 'STUDENT', 'GVS-2027-0108', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0109', 'GVS-2027-0109', 'Nipun Chawla', '2011-10-22', 'Male', 'class-9-b', 'Class 9', 'B', '19',
      'PAR0001', 'Mr. Deepak Chawla', '9845010109', 'parent.gvs20270109@gmail.com', 'Mr. Deepak Chawla', '9845010109', 'Civil Engineer',
      'Mrs. Sonal Chawla', 'Homemaker / Professional', '#12, 3th Cross, HSR Layout, Bengaluru - 560029', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4247 6853 1437', 'APAAR-KA-2026-900109', 'A-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0109', 'GVS-2027-0109', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Nipun Chawla', 'gvs-2027-0109@futureschool.edu', 'STUDENT', 'GVS-2027-0109', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0110', 'GVS-2027-0110', 'Mridula Agarwal', '2011-01-01', 'Female', 'class-9-b', 'Class 9', 'B', '20',
      'PAR0001', 'Mr. Rohan Agarwal', '9845010110', 'parent.gvs20270110@gmail.com', 'Mr. Rohan Agarwal', '9845010110', 'Software Engineer',
      'Mrs. Vinita Agarwal', 'Homemaker / Professional', '#23, 5th Cross, Malleshwaram, Bengaluru - 560030', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4260 6870 1460', 'APAAR-KA-2026-900110', 'B-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0110', 'GVS-2027-0110', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mridula Agarwal', 'gvs-2027-0110@futureschool.edu', 'STUDENT', 'GVS-2027-0110', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0111', 'GVS-2027-0111', 'Puneet Yadav', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '21',
      'PAR0001', 'Mr. Dhruv Yadav', '9845010111', 'parent.gvs20270111@gmail.com', 'Mr. Dhruv Yadav', '9845010111', 'Bank Officer',
      'Mrs. Deepali Yadav', 'Homemaker / Professional', '#34, 7th Cross, Jayanagar, Bengaluru - 560031', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4273 6887 1483', 'APAAR-KA-2026-900111', 'O+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0111', 'GVS-2027-0111', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Puneet Yadav', 'gvs-2027-0111@futureschool.edu', 'STUDENT', 'GVS-2027-0111', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0112', 'GVS-2027-0112', 'Niharika Poojary', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '22',
      'PAR0001', 'Mr. Utkarsh Poojary', '9845010112', 'parent.gvs20270112@gmail.com', 'Mr. Utkarsh Poojary', '9845010112', 'Professor',
      'Mrs. Komal Poojary', 'Homemaker / Professional', '#45, 9th Cross, Rajajinagar, Bengaluru - 560032', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4286 6904 1506', 'APAAR-KA-2026-900112', 'A+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0112', 'GVS-2027-0112', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Niharika Poojary', 'gvs-2027-0112@futureschool.edu', 'STUDENT', 'GVS-2027-0112', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0113', 'GVS-2027-0113', 'Ritesh Mishra', '2011-10-22', 'Male', 'class-9-b', 'Class 9', 'B', '23',
      'PAR0001', 'Mr. Kunal Mishra', '9845010113', 'parent.gvs20270113@gmail.com', 'Mr. Kunal Mishra', '9845010113', 'Physician',
      'Mrs. Parul Mishra', 'Homemaker / Professional', '#56, 11th Cross, Basavanagudi, Bengaluru - 560033', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4299 6921 1529', 'APAAR-KA-2026-900113', 'B+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0113', 'GVS-2027-0113', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ritesh Mishra', 'gvs-2027-0113@futureschool.edu', 'STUDENT', 'GVS-2027-0113', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0114', 'GVS-2027-0114', 'Payal Saxena', '2011-01-01', 'Female', 'class-9-b', 'Class 9', 'B', '24',
      'PAR0001', 'Mr. Sai Saxena', '9845010114', 'parent.gvs20270114@gmail.com', 'Mr. Sai Saxena', '9845010114', 'Architect',
      'Mrs. Tejaswi Saxena', 'Homemaker / Professional', '#67, 1th Cross, HSR Layout, Bengaluru - 560034', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4312 6938 1552', 'APAAR-KA-2026-900114', 'AB+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0114', 'GVS-2027-0114', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Payal Saxena', 'gvs-2027-0114@futureschool.edu', 'STUDENT', 'GVS-2027-0114', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0115', 'GVS-2027-0115', 'Sarthak Patel', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '25',
      'PAR0001', 'Mr. Chetan Patel', '9845010115', 'parent.gvs20270115@gmail.com', 'Mr. Chetan Patel', '9845010115', 'Chartered Accountant',
      'Mrs. Chetna Patel', 'Homemaker / Professional', '#78, 3th Cross, Malleshwaram, Bengaluru - 560035', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4325 6955 1575', 'APAAR-KA-2026-900115', 'O-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0115', 'GVS-2027-0115', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sarthak Patel', 'gvs-2027-0115@futureschool.edu', 'STUDENT', 'GVS-2027-0115', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0116', 'GVS-2027-0116', 'Rashmi Hegde', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '26',
      'PAR0001', 'Mr. Mayank Hegde', '9845010116', 'parent.gvs20270116@gmail.com', 'Mr. Mayank Hegde', '9845010116', 'Entrepreneur',
      'Mrs. Indu Hegde', 'Homemaker / Professional', '#89, 5th Cross, Jayanagar, Bengaluru - 560036', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4338 6972 1598', 'APAAR-KA-2026-900116', 'A-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0116', 'GVS-2027-0116', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Rashmi Hegde', 'gvs-2027-0116@futureschool.edu', 'STUDENT', 'GVS-2027-0116', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0117', 'GVS-2027-0117', 'Trilok Gokhale', '2011-10-22', 'Male', 'class-9-b', 'Class 9', 'B', '27',
      'PAR0001', 'Mr. Tarun Gokhale', '9845010117', 'parent.gvs20270117@gmail.com', 'Mr. Tarun Gokhale', '9845010117', 'Government Officer',
      'Mrs. Malini Gokhale', 'Homemaker / Professional', '#1, 7th Cross, Rajajinagar, Bengaluru - 560037', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4351 6989 1621', 'APAAR-KA-2026-900117', 'B-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0117', 'GVS-2027-0117', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Trilok Gokhale', 'gvs-2027-0117@futureschool.edu', 'STUDENT', 'GVS-2027-0117', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0118', 'GVS-2027-0118', 'Sonal Singh', '2011-01-01', 'Female', 'class-9-b', 'Class 9', 'B', '28',
      'PAR0001', 'Mr. Hemanth Singh', '9845010118', 'parent.gvs20270118@gmail.com', 'Mr. Hemanth Singh', '9845010118', 'Research Scientist',
      'Mrs. Rupa Singh', 'Homemaker / Professional', '#12, 9th Cross, Basavanagudi, Bengaluru - 560038', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4364 7006 1644', 'APAAR-KA-2026-900118', 'O+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0118', 'GVS-2027-0118', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sonal Singh', 'gvs-2027-0118@futureschool.edu', 'STUDENT', 'GVS-2027-0118', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0119', 'GVS-2027-0119', 'Vaibhav Rai', '2011-04-08', 'Male', 'class-9-b', 'Class 9', 'B', '29',
      'PAR0001', 'Mr. Puneet Rai', '9845010119', 'parent.gvs20270119@gmail.com', 'Mr. Puneet Rai', '9845010119', 'Civil Engineer',
      'Mrs. Varsha Rai', 'Homemaker / Professional', '#23, 11th Cross, HSR Layout, Bengaluru - 560039', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4377 7023 1667', 'APAAR-KA-2026-900119', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0119', 'GVS-2027-0119', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vaibhav Rai', 'gvs-2027-0119@futureschool.edu', 'STUDENT', 'GVS-2027-0119', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0120', 'GVS-2027-0120', 'Tanya Shastri', '2011-07-15', 'Female', 'class-9-b', 'Class 9', 'B', '30',
      'PAR0001', 'Mr. Yashas Shastri', '9845010120', 'parent.gvs20270120@gmail.com', 'Mr. Yashas Shastri', '9845010120', 'Software Engineer',
      'Mrs. Aadhya Shastri', 'Homemaker / Professional', '#34, 1th Cross, Malleshwaram, Bengaluru - 560040', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4390 7040 1690', 'APAAR-KA-2026-900120', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0120', 'GVS-2027-0120', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tanya Shastri', 'gvs-2027-0120@futureschool.edu', 'STUDENT', 'GVS-2027-0120', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;

-- Students for Class 8-A (30 Students)
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0121', 'GVS-2027-0121', 'Yashas Pathak', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '1',
      'PAR0001', 'Mr. Deepak Pathak', '9845010121', 'parent.gvs20270121@gmail.com', 'Mr. Deepak Pathak', '9845010121', 'Bank Officer',
      'Mrs. Avani Pathak', 'Homemaker / Professional', '#12, 3th Cross, Jayanagar, Bengaluru - 560011', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4013 7057 1023', 'APAAR-KA-2026-900121', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0121', 'GVS-2027-0121', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Yashas Pathak', 'gvs-2027-0121@futureschool.edu', 'STUDENT', 'GVS-2027-0121', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0122', 'GVS-2027-0122', 'Upasana Reddy', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '2',
      'PAR0001', 'Mr. Rohan Reddy', '9845010122', 'parent.gvs20270122@gmail.com', 'Mr. Rohan Reddy', '9845010122', 'Professor',
      'Mrs. Kavya Reddy', 'Homemaker / Professional', '#23, 5th Cross, Rajajinagar, Bengaluru - 560012', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4026 7074 1046', 'APAAR-KA-2026-900122', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0122', 'GVS-2027-0122', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Upasana Reddy', 'gvs-2027-0122@futureschool.edu', 'STUDENT', 'GVS-2027-0122', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0123', 'GVS-2027-0123', 'Abhinav Joshi', '2012-10-22', 'Male', 'class-8-a', 'Class 8', 'A', '3',
      'PAR0001', 'Mr. Dhruv Joshi', '9845010123', 'parent.gvs20270123@gmail.com', 'Mr. Dhruv Joshi', '9845010123', 'Physician',
      'Mrs. Riya Joshi', 'Homemaker / Professional', '#34, 7th Cross, Basavanagudi, Bengaluru - 560013', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4039 7091 1069', 'APAAR-KA-2026-900123', 'AB+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0123', 'GVS-2027-0123', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Abhinav Joshi', 'gvs-2027-0123@futureschool.edu', 'STUDENT', 'GVS-2027-0123', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0124', 'GVS-2027-0124', 'Vinita Murthy', '2012-01-01', 'Female', 'class-8-a', 'Class 8', 'A', '4',
      'PAR0001', 'Mr. Utkarsh Murthy', '9845010124', 'parent.gvs20270124@gmail.com', 'Mr. Utkarsh Murthy', '9845010124', 'Architect',
      'Mrs. Anika Murthy', 'Homemaker / Professional', '#45, 9th Cross, HSR Layout, Bengaluru - 560014', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4052 7108 1092', 'APAAR-KA-2026-900124', 'O-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0124', 'GVS-2027-0124', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vinita Murthy', 'gvs-2027-0124@futureschool.edu', 'STUDENT', 'GVS-2027-0124', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0125', 'GVS-2027-0125', 'Bhuvan Mukherjee', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '5',
      'PAR0001', 'Mr. Kunal Mukherjee', '9845010125', 'parent.gvs20270125@gmail.com', 'Mr. Kunal Mukherjee', '9845010125', 'Chartered Accountant',
      'Mrs. Nandini Mukherjee', 'Homemaker / Professional', '#56, 11th Cross, Malleshwaram, Bengaluru - 560015', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4065 7125 1115', 'APAAR-KA-2026-900125', 'A-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0125', 'GVS-2027-0125', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Bhuvan Mukherjee', 'gvs-2027-0125@futureschool.edu', 'STUDENT', 'GVS-2027-0125', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0126', 'GVS-2027-0126', 'Yukta Shetty', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '6',
      'PAR0001', 'Mr. Sai Shetty', '9845010126', 'parent.gvs20270126@gmail.com', 'Mr. Sai Shetty', '9845010126', 'Entrepreneur',
      'Mrs. Saanvi Shetty', 'Homemaker / Professional', '#67, 1th Cross, Jayanagar, Bengaluru - 560016', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4078 7142 1138', 'APAAR-KA-2026-900126', 'B-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0126', 'GVS-2027-0126', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Yukta Shetty', 'gvs-2027-0126@futureschool.edu', 'STUDENT', 'GVS-2027-0126', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0127', 'GVS-2027-0127', 'Chirag Pai', '2012-10-22', 'Male', 'class-8-a', 'Class 8', 'A', '7',
      'PAR0001', 'Mr. Chetan Pai', '9845010127', 'parent.gvs20270127@gmail.com', 'Mr. Chetan Pai', '9845010127', 'Government Officer',
      'Mrs. Vanya Pai', 'Homemaker / Professional', '#78, 3th Cross, Rajajinagar, Bengaluru - 560017', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4091 7159 1161', 'APAAR-KA-2026-900127', 'O+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0127', 'GVS-2027-0127', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Chirag Pai', 'gvs-2027-0127@futureschool.edu', 'STUDENT', 'GVS-2027-0127', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0128', 'GVS-2027-0128', 'Amrita Tripathi', '2012-01-01', 'Female', 'class-8-a', 'Class 8', 'A', '8',
      'PAR0001', 'Mr. Mayank Tripathi', '9845010128', 'parent.gvs20270128@gmail.com', 'Mr. Mayank Tripathi', '9845010128', 'Research Scientist',
      'Mrs. Bhavna Tripathi', 'Homemaker / Professional', '#89, 5th Cross, Basavanagudi, Bengaluru - 560018', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4104 7176 1184', 'APAAR-KA-2026-900128', 'A+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0128', 'GVS-2027-0128', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Amrita Tripathi', 'gvs-2027-0128@futureschool.edu', 'STUDENT', 'GVS-2027-0128', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0129', 'GVS-2027-0129', 'Dinesh Deshmukh', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '9',
      'PAR0001', 'Mr. Tarun Deshmukh', '9845010129', 'parent.gvs20270129@gmail.com', 'Mr. Tarun Deshmukh', '9845010129', 'Civil Engineer',
      'Mrs. Esha Deshmukh', 'Homemaker / Professional', '#1, 7th Cross, HSR Layout, Bengaluru - 560019', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4117 7193 1207', 'APAAR-KA-2026-900129', 'B+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0129', 'GVS-2027-0129', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Dinesh Deshmukh', 'gvs-2027-0129@futureschool.edu', 'STUDENT', 'GVS-2027-0129', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0130', 'GVS-2027-0130', 'Deepali Rao', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '10',
      'PAR0001', 'Mr. Hemanth Rao', '9845010130', 'parent.gvs20270130@gmail.com', 'Mr. Hemanth Rao', '9845010130', 'Software Engineer',
      'Mrs. Ira Rao', 'Homemaker / Professional', '#12, 9th Cross, Malleshwaram, Bengaluru - 560020', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4130 7210 1230', 'APAAR-KA-2026-900130', 'AB+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0130', 'GVS-2027-0130', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Deepali Rao', 'gvs-2027-0130@futureschool.edu', 'STUDENT', 'GVS-2027-0130', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0131', 'GVS-2027-0131', 'Harish Bhat', '2012-10-22', 'Male', 'class-8-a', 'Class 8', 'A', '11',
      'PAR0001', 'Mr. Puneet Bhat', '9845010131', 'parent.gvs20270131@gmail.com', 'Mr. Puneet Bhat', '9845010131', 'Bank Officer',
      'Mrs. Lavanya Bhat', 'Homemaker / Professional', '#23, 11th Cross, Jayanagar, Bengaluru - 560021', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4143 7227 1253', 'APAAR-KA-2026-900131', 'O-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0131', 'GVS-2027-0131', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Harish Bhat', 'gvs-2027-0131@futureschool.edu', 'STUDENT', 'GVS-2027-0131', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0132', 'GVS-2027-0132', 'Gauri Bose', '2012-01-01', 'Female', 'class-8-a', 'Class 8', 'A', '12',
      'PAR0001', 'Mr. Yashas Bose', '9845010132', 'parent.gvs20270132@gmail.com', 'Mr. Yashas Bose', '9845010132', 'Professor',
      'Mrs. Palak Bose', 'Homemaker / Professional', '#34, 1th Cross, Rajajinagar, Bengaluru - 560022', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4156 7244 1276', 'APAAR-KA-2026-900132', 'A-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0132', 'GVS-2027-0132', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Gauri Bose', 'gvs-2027-0132@futureschool.edu', 'STUDENT', 'GVS-2027-0132', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0133', 'GVS-2027-0133', 'Kartik Nambiar', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '13',
      'PAR0001', 'Mr. Harish Nambiar', '9845010133', 'parent.gvs20270133@gmail.com', 'Mr. Harish Nambiar', '9845010133', 'Physician',
      'Mrs. Trisha Nambiar', 'Homemaker / Professional', '#45, 3th Cross, Basavanagudi, Bengaluru - 560023', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4169 7261 1299', 'APAAR-KA-2026-900133', 'B-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0133', 'GVS-2027-0133', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kartik Nambiar', 'gvs-2027-0133@futureschool.edu', 'STUDENT', 'GVS-2027-0133', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0134', 'GVS-2027-0134', 'Janaki Prabhu', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '14',
      'PAR0001', 'Mr. Pawan Prabhu', '9845010134', 'parent.gvs20270134@gmail.com', 'Mr. Pawan Prabhu', '9845010134', 'Architect',
      'Mrs. Yamini Prabhu', 'Homemaker / Professional', '#56, 5th Cross, HSR Layout, Bengaluru - 560024', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4182 7278 1322', 'APAAR-KA-2026-900134', 'O+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0134', 'GVS-2027-0134', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Janaki Prabhu', 'gvs-2027-0134@futureschool.edu', 'STUDENT', 'GVS-2027-0134', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0135', 'GVS-2027-0135', 'Lalit Dubey', '2012-10-22', 'Male', 'class-8-a', 'Class 8', 'A', '15',
      'PAR0001', 'Mr. Yogesh Dubey', '9845010135', 'parent.gvs20270135@gmail.com', 'Mr. Yogesh Dubey', '9845010135', 'Chartered Accountant',
      'Mrs. Chhavi Dubey', 'Homemaker / Professional', '#67, 7th Cross, Malleshwaram, Bengaluru - 560025', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4195 7295 1345', 'APAAR-KA-2026-900135', 'A+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0135', 'GVS-2027-0135', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Lalit Dubey', 'gvs-2027-0135@futureschool.edu', 'STUDENT', 'GVS-2027-0135', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0136', 'GVS-2027-0136', 'Komal Nair', '2012-01-01', 'Female', 'class-8-a', 'Class 8', 'A', '16',
      'PAR0001', 'Mr. Hitesh Nair', '9845010136', 'parent.gvs20270136@gmail.com', 'Mr. Hitesh Nair', '9845010136', 'Entrepreneur',
      'Mrs. Hema Nair', 'Homemaker / Professional', '#78, 9th Cross, Jayanagar, Bengaluru - 560026', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4208 7312 1368', 'APAAR-KA-2026-900136', 'B+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0136', 'GVS-2027-0136', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Komal Nair', 'gvs-2027-0136@futureschool.edu', 'STUDENT', 'GVS-2027-0136', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0137', 'GVS-2027-0137', 'Mohit Pillai', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '17',
      'PAR0001', 'Mr. Prakash Pillai', '9845010137', 'parent.gvs20270137@gmail.com', 'Mr. Prakash Pillai', '9845010137', 'Government Officer',
      'Mrs. Keerthi Pillai', 'Homemaker / Professional', '#89, 11th Cross, Rajajinagar, Bengaluru - 560027', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4221 7329 1391', 'APAAR-KA-2026-900137', 'AB+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0137', 'GVS-2027-0137', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Mohit Pillai', 'gvs-2027-0137@futureschool.edu', 'STUDENT', 'GVS-2027-0137', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0138', 'GVS-2027-0138', 'Madhavi Mehra', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '18',
      'PAR0001', 'Mr. Aarav Mehra', '9845010138', 'parent.gvs20270138@gmail.com', 'Mr. Aarav Mehra', '9845010138', 'Research Scientist',
      'Mrs. Niharika Mehra', 'Homemaker / Professional', '#1, 1th Cross, Basavanagudi, Bengaluru - 560028', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4234 7346 1414', 'APAAR-KA-2026-900138', 'O-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0138', 'GVS-2027-0138', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Madhavi Mehra', 'gvs-2027-0138@futureschool.edu', 'STUDENT', 'GVS-2027-0138', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0139', 'GVS-2027-0139', 'Nitin Banerjee', '2012-10-22', 'Male', 'class-8-a', 'Class 8', 'A', '19',
      'PAR0001', 'Mr. Deepak Banerjee', '9845010139', 'parent.gvs20270139@gmail.com', 'Mr. Deepak Banerjee', '9845010139', 'Civil Engineer',
      'Mrs. Sonal Banerjee', 'Homemaker / Professional', '#12, 3th Cross, HSR Layout, Bengaluru - 560029', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4247 7363 1437', 'APAAR-KA-2026-900139', 'A-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0139', 'GVS-2027-0139', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Nitin Banerjee', 'gvs-2027-0139@futureschool.edu', 'STUDENT', 'GVS-2027-0139', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0140', 'GVS-2027-0140', 'Nalini Menon', '2012-01-01', 'Female', 'class-8-a', 'Class 8', 'A', '20',
      'PAR0001', 'Mr. Rohan Menon', '9845010140', 'parent.gvs20270140@gmail.com', 'Mr. Rohan Menon', '9845010140', 'Software Engineer',
      'Mrs. Vinita Menon', 'Homemaker / Professional', '#23, 5th Cross, Malleshwaram, Bengaluru - 560030', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4260 7380 1460', 'APAAR-KA-2026-900140', 'B-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0140', 'GVS-2027-0140', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Nalini Menon', 'gvs-2027-0140@futureschool.edu', 'STUDENT', 'GVS-2027-0140', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0141', 'GVS-2027-0141', 'Pawan Nayak', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '21',
      'PAR0001', 'Mr. Dhruv Nayak', '9845010141', 'parent.gvs20270141@gmail.com', 'Mr. Dhruv Nayak', '9845010141', 'Bank Officer',
      'Mrs. Deepali Nayak', 'Homemaker / Professional', '#34, 7th Cross, Jayanagar, Bengaluru - 560031', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4273 7397 1483', 'APAAR-KA-2026-900141', 'O+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0141', 'GVS-2027-0141', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Pawan Nayak', 'gvs-2027-0141@futureschool.edu', 'STUDENT', 'GVS-2027-0141', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0142', 'GVS-2027-0142', 'Parul Shukla', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '22',
      'PAR0001', 'Mr. Utkarsh Shukla', '9845010142', 'parent.gvs20270142@gmail.com', 'Mr. Utkarsh Shukla', '9845010142', 'Professor',
      'Mrs. Komal Shukla', 'Homemaker / Professional', '#45, 9th Cross, Rajajinagar, Bengaluru - 560032', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4286 7414 1506', 'APAAR-KA-2026-900142', 'A+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0142', 'GVS-2027-0142', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Parul Shukla', 'gvs-2027-0142@futureschool.edu', 'STUDENT', 'GVS-2027-0142', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0143', 'GVS-2027-0143', 'Rajat Verma', '2012-10-22', 'Male', 'class-8-a', 'Class 8', 'A', '23',
      'PAR0001', 'Mr. Kunal Verma', '9845010143', 'parent.gvs20270143@gmail.com', 'Mr. Kunal Verma', '9845010143', 'Physician',
      'Mrs. Parul Verma', 'Homemaker / Professional', '#56, 11th Cross, Basavanagudi, Bengaluru - 560033', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4299 7431 1529', 'APAAR-KA-2026-900143', 'B+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0143', 'GVS-2027-0143', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Rajat Verma', 'gvs-2027-0143@futureschool.edu', 'STUDENT', 'GVS-2027-0143', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0144', 'GVS-2027-0144', 'Ritu Kulkarni', '2012-01-01', 'Female', 'class-8-a', 'Class 8', 'A', '24',
      'PAR0001', 'Mr. Sai Kulkarni', '9845010144', 'parent.gvs20270144@gmail.com', 'Mr. Sai Kulkarni', '9845010144', 'Architect',
      'Mrs. Tejaswi Kulkarni', 'Homemaker / Professional', '#67, 1th Cross, HSR Layout, Bengaluru - 560034', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4312 7448 1552', 'APAAR-KA-2026-900144', 'AB+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0144', 'GVS-2027-0144', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Ritu Kulkarni', 'gvs-2027-0144@futureschool.edu', 'STUDENT', 'GVS-2027-0144', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0145', 'GVS-2027-0145', 'Sachin Kapoor', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '25',
      'PAR0001', 'Mr. Chetan Kapoor', '9845010145', 'parent.gvs20270145@gmail.com', 'Mr. Chetan Kapoor', '9845010145', 'Chartered Accountant',
      'Mrs. Chetna Kapoor', 'Homemaker / Professional', '#78, 3th Cross, Malleshwaram, Bengaluru - 560035', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4325 7465 1575', 'APAAR-KA-2026-900145', 'O-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0145', 'GVS-2027-0145', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sachin Kapoor', 'gvs-2027-0145@futureschool.edu', 'STUDENT', 'GVS-2027-0145', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0146', 'GVS-2027-0146', 'Swati Chatterjee', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '26',
      'PAR0001', 'Mr. Mayank Chatterjee', '9845010146', 'parent.gvs20270146@gmail.com', 'Mr. Mayank Chatterjee', '9845010146', 'Entrepreneur',
      'Mrs. Indu Chatterjee', 'Homemaker / Professional', '#89, 5th Cross, Jayanagar, Bengaluru - 560036', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4338 7482 1598', 'APAAR-KA-2026-900146', 'A-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0146', 'GVS-2027-0146', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Swati Chatterjee', 'gvs-2027-0146@futureschool.edu', 'STUDENT', 'GVS-2027-0146', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0147', 'GVS-2027-0147', 'Uday Rathore', '2012-10-22', 'Male', 'class-8-a', 'Class 8', 'A', '27',
      'PAR0001', 'Mr. Tarun Rathore', '9845010147', 'parent.gvs20270147@gmail.com', 'Mr. Tarun Rathore', '9845010147', 'Government Officer',
      'Mrs. Malini Rathore', 'Homemaker / Professional', '#1, 7th Cross, Rajajinagar, Bengaluru - 560037', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4351 7499 1621', 'APAAR-KA-2026-900147', 'B-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0147', 'GVS-2027-0147', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Uday Rathore', 'gvs-2027-0147@futureschool.edu', 'STUDENT', 'GVS-2027-0147', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0148', 'GVS-2027-0148', 'Tejaswi Kamat', '2012-01-01', 'Female', 'class-8-a', 'Class 8', 'A', '28',
      'PAR0001', 'Mr. Hemanth Kamat', '9845010148', 'parent.gvs20270148@gmail.com', 'Mr. Hemanth Kamat', '9845010148', 'Research Scientist',
      'Mrs. Rupa Kamat', 'Homemaker / Professional', '#12, 9th Cross, Basavanagudi, Bengaluru - 560038', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4364 7516 1644', 'APAAR-KA-2026-900148', 'O+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0148', 'GVS-2027-0148', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tejaswi Kamat', 'gvs-2027-0148@futureschool.edu', 'STUDENT', 'GVS-2027-0148', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0149', 'GVS-2027-0149', 'Vimal Tiwari', '2012-04-08', 'Male', 'class-8-a', 'Class 8', 'A', '29',
      'PAR0001', 'Mr. Puneet Tiwari', '9845010149', 'parent.gvs20270149@gmail.com', 'Mr. Puneet Tiwari', '9845010149', 'Civil Engineer',
      'Mrs. Varsha Tiwari', 'Homemaker / Professional', '#23, 11th Cross, HSR Layout, Bengaluru - 560039', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4377 7533 1667', 'APAAR-KA-2026-900149', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0149', 'GVS-2027-0149', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vimal Tiwari', 'gvs-2027-0149@futureschool.edu', 'STUDENT', 'GVS-2027-0149', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0150', 'GVS-2027-0150', 'Vandana Sharma', '2012-07-15', 'Female', 'class-8-a', 'Class 8', 'A', '30',
      'PAR0001', 'Mr. Yashas Sharma', '9845010150', 'parent.gvs20270150@gmail.com', 'Mr. Yashas Sharma', '9845010150', 'Software Engineer',
      'Mrs. Aadhya Sharma', 'Homemaker / Professional', '#34, 1th Cross, Malleshwaram, Bengaluru - 560040', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4390 7550 1690', 'APAAR-KA-2026-900150', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0150', 'GVS-2027-0150', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vandana Sharma', 'gvs-2027-0150@futureschool.edu', 'STUDENT', 'GVS-2027-0150', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;

-- Students for Class 8-B (30 Students)
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0151', 'GVS-2027-0151', 'Yogesh Iyer', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '1',
      'PAR0001', 'Mr. Deepak Iyer', '9845010151', 'parent.gvs20270151@gmail.com', 'Mr. Deepak Iyer', '9845010151', 'Bank Officer',
      'Mrs. Avani Iyer', 'Homemaker / Professional', '#12, 3th Cross, Jayanagar, Bengaluru - 560011', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4013 7567 1023', 'APAAR-KA-2026-900151', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0151', 'GVS-2027-0151', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Yogesh Iyer', 'gvs-2027-0151@futureschool.edu', 'STUDENT', 'GVS-2027-0151', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0152', 'GVS-2027-0152', 'Aarti Malhotra', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '2',
      'PAR0001', 'Mr. Rohan Malhotra', '9845010152', 'parent.gvs20270152@gmail.com', 'Mr. Rohan Malhotra', '9845010152', 'Professor',
      'Mrs. Kavya Malhotra', 'Homemaker / Professional', '#23, 5th Cross, Rajajinagar, Bengaluru - 560012', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4026 7584 1046', 'APAAR-KA-2026-900152', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0152', 'GVS-2027-0152', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Aarti Malhotra', 'gvs-2027-0152@futureschool.edu', 'STUDENT', 'GVS-2027-0152', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0153', 'GVS-2027-0153', 'Akhil Gupta', '2012-10-22', 'Male', 'class-8-b', 'Class 8', 'B', '3',
      'PAR0001', 'Mr. Dhruv Gupta', '9845010153', 'parent.gvs20270153@gmail.com', 'Mr. Dhruv Gupta', '9845010153', 'Physician',
      'Mrs. Riya Gupta', 'Homemaker / Professional', '#34, 7th Cross, Basavanagudi, Bengaluru - 560013', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4039 7601 1069', 'APAAR-KA-2026-900153', 'AB+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0153', 'GVS-2027-0153', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Akhil Gupta', 'gvs-2027-0153@futureschool.edu', 'STUDENT', 'GVS-2027-0153', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0154', 'GVS-2027-0154', 'Chetna Chauhan', '2012-01-01', 'Female', 'class-8-b', 'Class 8', 'B', '4',
      'PAR0001', 'Mr. Utkarsh Chauhan', '9845010154', 'parent.gvs20270154@gmail.com', 'Mr. Utkarsh Chauhan', '9845010154', 'Architect',
      'Mrs. Anika Chauhan', 'Homemaker / Professional', '#45, 9th Cross, HSR Layout, Bengaluru - 560014', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4052 7618 1092', 'APAAR-KA-2026-900154', 'O-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0154', 'GVS-2027-0154', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Chetna Chauhan', 'gvs-2027-0154@futureschool.edu', 'STUDENT', 'GVS-2027-0154', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0155', 'GVS-2027-0155', 'Bharat Shenoy', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '5',
      'PAR0001', 'Mr. Kunal Shenoy', '9845010155', 'parent.gvs20270155@gmail.com', 'Mr. Kunal Shenoy', '9845010155', 'Chartered Accountant',
      'Mrs. Nandini Shenoy', 'Homemaker / Professional', '#56, 11th Cross, Malleshwaram, Bengaluru - 560015', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4065 7635 1115', 'APAAR-KA-2026-900155', 'A-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0155', 'GVS-2027-0155', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Bharat Shenoy', 'gvs-2027-0155@futureschool.edu', 'STUDENT', 'GVS-2027-0155', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0156', 'GVS-2027-0156', 'Devika Pandey', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '6',
      'PAR0001', 'Mr. Sai Pandey', '9845010156', 'parent.gvs20270156@gmail.com', 'Mr. Sai Pandey', '9845010156', 'Entrepreneur',
      'Mrs. Saanvi Pandey', 'Homemaker / Professional', '#67, 1th Cross, Jayanagar, Bengaluru - 560016', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4078 7652 1138', 'APAAR-KA-2026-900156', 'B-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0156', 'GVS-2027-0156', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Devika Pandey', 'gvs-2027-0156@futureschool.edu', 'STUDENT', 'GVS-2027-0156', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0157', 'GVS-2027-0157', 'Devesh Srivastava', '2012-10-22', 'Male', 'class-8-b', 'Class 8', 'B', '7',
      'PAR0001', 'Mr. Chetan Srivastava', '9845010157', 'parent.gvs20270157@gmail.com', 'Mr. Chetan Srivastava', '9845010157', 'Government Officer',
      'Mrs. Vanya Srivastava', 'Homemaker / Professional', '#78, 3th Cross, Rajajinagar, Bengaluru - 560017', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4091 7669 1161', 'APAAR-KA-2026-900157', 'O+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0157', 'GVS-2027-0157', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Devesh Srivastava', 'gvs-2027-0157@futureschool.edu', 'STUDENT', 'GVS-2027-0157', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0158', 'GVS-2027-0158', 'Geeta Sen', '2012-01-01', 'Female', 'class-8-b', 'Class 8', 'B', '8',
      'PAR0001', 'Mr. Mayank Sen', '9845010158', 'parent.gvs20270158@gmail.com', 'Mr. Mayank Sen', '9845010158', 'Research Scientist',
      'Mrs. Bhavna Sen', 'Homemaker / Professional', '#89, 5th Cross, Basavanagudi, Bengaluru - 560018', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4104 7686 1184', 'APAAR-KA-2026-900158', 'A+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0158', 'GVS-2027-0158', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Geeta Sen', 'gvs-2027-0158@futureschool.edu', 'STUDENT', 'GVS-2027-0158', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0159', 'GVS-2027-0159', 'Gagan Chawla', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '9',
      'PAR0001', 'Mr. Tarun Chawla', '9845010159', 'parent.gvs20270159@gmail.com', 'Mr. Tarun Chawla', '9845010159', 'Civil Engineer',
      'Mrs. Esha Chawla', 'Homemaker / Professional', '#1, 7th Cross, HSR Layout, Bengaluru - 560019', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4117 7703 1207', 'APAAR-KA-2026-900159', 'B+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0159', 'GVS-2027-0159', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Gagan Chawla', 'gvs-2027-0159@futureschool.edu', 'STUDENT', 'GVS-2027-0159', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0160', 'GVS-2027-0160', 'Indu Agarwal', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '10',
      'PAR0001', 'Mr. Hemanth Agarwal', '9845010160', 'parent.gvs20270160@gmail.com', 'Mr. Hemanth Agarwal', '9845010160', 'Software Engineer',
      'Mrs. Ira Agarwal', 'Homemaker / Professional', '#12, 9th Cross, Malleshwaram, Bengaluru - 560020', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4130 7720 1230', 'APAAR-KA-2026-900160', 'AB+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0160', 'GVS-2027-0160', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Indu Agarwal', 'gvs-2027-0160@futureschool.edu', 'STUDENT', 'GVS-2027-0160', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0161', 'GVS-2027-0161', 'Hitesh Yadav', '2012-10-22', 'Male', 'class-8-b', 'Class 8', 'B', '11',
      'PAR0001', 'Mr. Puneet Yadav', '9845010161', 'parent.gvs20270161@gmail.com', 'Mr. Puneet Yadav', '9845010161', 'Bank Officer',
      'Mrs. Lavanya Yadav', 'Homemaker / Professional', '#23, 11th Cross, Jayanagar, Bengaluru - 560021', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4143 7737 1253', 'APAAR-KA-2026-900161', 'O-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0161', 'GVS-2027-0161', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Hitesh Yadav', 'gvs-2027-0161@futureschool.edu', 'STUDENT', 'GVS-2027-0161', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0162', 'GVS-2027-0162', 'Kalyani Poojary', '2012-01-01', 'Female', 'class-8-b', 'Class 8', 'B', '12',
      'PAR0001', 'Mr. Yashas Poojary', '9845010162', 'parent.gvs20270162@gmail.com', 'Mr. Yashas Poojary', '9845010162', 'Professor',
      'Mrs. Palak Poojary', 'Homemaker / Professional', '#34, 1th Cross, Rajajinagar, Bengaluru - 560022', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4156 7754 1276', 'APAAR-KA-2026-900162', 'A-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0162', 'GVS-2027-0162', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kalyani Poojary', 'gvs-2027-0162@futureschool.edu', 'STUDENT', 'GVS-2027-0162', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0163', 'GVS-2027-0163', 'Jagdish Mishra', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '13',
      'PAR0001', 'Mr. Harish Mishra', '9845010163', 'parent.gvs20270163@gmail.com', 'Mr. Harish Mishra', '9845010163', 'Physician',
      'Mrs. Trisha Mishra', 'Homemaker / Professional', '#45, 3th Cross, Basavanagudi, Bengaluru - 560023', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4169 7771 1299', 'APAAR-KA-2026-900163', 'B-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0163', 'GVS-2027-0163', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Jagdish Mishra', 'gvs-2027-0163@futureschool.edu', 'STUDENT', 'GVS-2027-0163', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0164', 'GVS-2027-0164', 'Leela Saxena', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '14',
      'PAR0001', 'Mr. Pawan Saxena', '9845010164', 'parent.gvs20270164@gmail.com', 'Mr. Pawan Saxena', '9845010164', 'Architect',
      'Mrs. Yamini Saxena', 'Homemaker / Professional', '#56, 5th Cross, HSR Layout, Bengaluru - 560024', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4182 7788 1322', 'APAAR-KA-2026-900164', 'O+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0164', 'GVS-2027-0164', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Leela Saxena', 'gvs-2027-0164@futureschool.edu', 'STUDENT', 'GVS-2027-0164', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0165', 'GVS-2027-0165', 'Kiran Patel', '2012-10-22', 'Male', 'class-8-b', 'Class 8', 'B', '15',
      'PAR0001', 'Mr. Yogesh Patel', '9845010165', 'parent.gvs20270165@gmail.com', 'Mr. Yogesh Patel', '9845010165', 'Chartered Accountant',
      'Mrs. Chhavi Patel', 'Homemaker / Professional', '#67, 7th Cross, Malleshwaram, Bengaluru - 560025', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4195 7805 1345', 'APAAR-KA-2026-900165', 'A+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0165', 'GVS-2027-0165', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Kiran Patel', 'gvs-2027-0165@futureschool.edu', 'STUDENT', 'GVS-2027-0165', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0166', 'GVS-2027-0166', 'Malini Hegde', '2012-01-01', 'Female', 'class-8-b', 'Class 8', 'B', '16',
      'PAR0001', 'Mr. Hitesh Hegde', '9845010166', 'parent.gvs20270166@gmail.com', 'Mr. Hitesh Hegde', '9845010166', 'Entrepreneur',
      'Mrs. Hema Hegde', 'Homemaker / Professional', '#78, 9th Cross, Jayanagar, Bengaluru - 560026', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4208 7822 1368', 'APAAR-KA-2026-900166', 'B+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0166', 'GVS-2027-0166', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Malini Hegde', 'gvs-2027-0166@futureschool.edu', 'STUDENT', 'GVS-2027-0166', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0167', 'GVS-2027-0167', 'Madhur Gokhale', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '17',
      'PAR0001', 'Mr. Prakash Gokhale', '9845010167', 'parent.gvs20270167@gmail.com', 'Mr. Prakash Gokhale', '9845010167', 'Government Officer',
      'Mrs. Keerthi Gokhale', 'Homemaker / Professional', '#89, 11th Cross, Rajajinagar, Bengaluru - 560027', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4221 7839 1391', 'APAAR-KA-2026-900167', 'AB+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0167', 'GVS-2027-0167', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Madhur Gokhale', 'gvs-2027-0167@futureschool.edu', 'STUDENT', 'GVS-2027-0167', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0168', 'GVS-2027-0168', 'Nita Singh', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '18',
      'PAR0001', 'Mr. Aarav Singh', '9845010168', 'parent.gvs20270168@gmail.com', 'Mr. Aarav Singh', '9845010168', 'Research Scientist',
      'Mrs. Niharika Singh', 'Homemaker / Professional', '#1, 1th Cross, Basavanagudi, Bengaluru - 560028', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4234 7856 1414', 'APAAR-KA-2026-900168', 'O-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0168', 'GVS-2027-0168', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Nita Singh', 'gvs-2027-0168@futureschool.edu', 'STUDENT', 'GVS-2027-0168', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0169', 'GVS-2027-0169', 'Naman Rai', '2012-10-22', 'Male', 'class-8-b', 'Class 8', 'B', '19',
      'PAR0001', 'Mr. Deepak Rai', '9845010169', 'parent.gvs20270169@gmail.com', 'Mr. Deepak Rai', '9845010169', 'Civil Engineer',
      'Mrs. Sonal Rai', 'Homemaker / Professional', '#12, 3th Cross, HSR Layout, Bengaluru - 560029', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4247 7873 1437', 'APAAR-KA-2026-900169', 'A-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0169', 'GVS-2027-0169', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Naman Rai', 'gvs-2027-0169@futureschool.edu', 'STUDENT', 'GVS-2027-0169', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0170', 'GVS-2027-0170', 'Pallavi Shastri', '2012-01-01', 'Female', 'class-8-b', 'Class 8', 'B', '20',
      'PAR0001', 'Mr. Rohan Shastri', '9845010170', 'parent.gvs20270170@gmail.com', 'Mr. Rohan Shastri', '9845010170', 'Software Engineer',
      'Mrs. Vinita Shastri', 'Homemaker / Professional', '#23, 5th Cross, Malleshwaram, Bengaluru - 560030', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4260 7890 1460', 'APAAR-KA-2026-900170', 'B-', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0170', 'GVS-2027-0170', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Pallavi Shastri', 'gvs-2027-0170@futureschool.edu', 'STUDENT', 'GVS-2027-0170', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0171', 'GVS-2027-0171', 'Prakash Pathak', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '21',
      'PAR0001', 'Mr. Dhruv Pathak', '9845010171', 'parent.gvs20270171@gmail.com', 'Mr. Dhruv Pathak', '9845010171', 'Bank Officer',
      'Mrs. Deepali Pathak', 'Homemaker / Professional', '#34, 7th Cross, Jayanagar, Bengaluru - 560031', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4273 7907 1483', 'APAAR-KA-2026-900171', 'O+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0171', 'GVS-2027-0171', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Prakash Pathak', 'gvs-2027-0171@futureschool.edu', 'STUDENT', 'GVS-2027-0171', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0172', 'GVS-2027-0172', 'Rupa Reddy', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '22',
      'PAR0001', 'Mr. Utkarsh Reddy', '9845010172', 'parent.gvs20270172@gmail.com', 'Mr. Utkarsh Reddy', '9845010172', 'Professor',
      'Mrs. Komal Reddy', 'Homemaker / Professional', '#45, 9th Cross, Rajajinagar, Bengaluru - 560032', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4286 7924 1506', 'APAAR-KA-2026-900172', 'A+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0172', 'GVS-2027-0172', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Rupa Reddy', 'gvs-2027-0172@futureschool.edu', 'STUDENT', 'GVS-2027-0172', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0173', 'GVS-2027-0173', 'Rakesh Joshi', '2012-10-22', 'Male', 'class-8-b', 'Class 8', 'B', '23',
      'PAR0001', 'Mr. Kunal Joshi', '9845010173', 'parent.gvs20270173@gmail.com', 'Mr. Kunal Joshi', '9845010173', 'Physician',
      'Mrs. Parul Joshi', 'Homemaker / Professional', '#56, 11th Cross, Basavanagudi, Bengaluru - 560033', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4299 7941 1529', 'APAAR-KA-2026-900173', 'B+', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0173', 'GVS-2027-0173', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Rakesh Joshi', 'gvs-2027-0173@futureschool.edu', 'STUDENT', 'GVS-2027-0173', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0174', 'GVS-2027-0174', 'Sarita Murthy', '2012-01-01', 'Female', 'class-8-b', 'Class 8', 'B', '24',
      'PAR0001', 'Mr. Sai Murthy', '9845010174', 'parent.gvs20270174@gmail.com', 'Mr. Sai Murthy', '9845010174', 'Architect',
      'Mrs. Tejaswi Murthy', 'Homemaker / Professional', '#67, 1th Cross, HSR Layout, Bengaluru - 560034', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4312 7958 1552', 'APAAR-KA-2026-900174', 'AB+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0174', 'GVS-2027-0174', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sarita Murthy', 'gvs-2027-0174@futureschool.edu', 'STUDENT', 'GVS-2027-0174', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0175', 'GVS-2027-0175', 'Sandeep Mukherjee', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '25',
      'PAR0001', 'Mr. Chetan Mukherjee', '9845010175', 'parent.gvs20270175@gmail.com', 'Mr. Chetan Mukherjee', '9845010175', 'Chartered Accountant',
      'Mrs. Chetna Mukherjee', 'Homemaker / Professional', '#78, 3th Cross, Malleshwaram, Bengaluru - 560035', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4325 7975 1575', 'APAAR-KA-2026-900175', 'O-', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0175', 'GVS-2027-0175', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Sandeep Mukherjee', 'gvs-2027-0175@futureschool.edu', 'STUDENT', 'GVS-2027-0175', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0176', 'GVS-2027-0176', 'Tulsi Shetty', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '26',
      'PAR0001', 'Mr. Mayank Shetty', '9845010176', 'parent.gvs20270176@gmail.com', 'Mr. Mayank Shetty', '9845010176', 'Entrepreneur',
      'Mrs. Indu Shetty', 'Homemaker / Professional', '#89, 5th Cross, Jayanagar, Bengaluru - 560036', 'Bengaluru Urban', 'Jayanagar', '560003',
      '4338 7992 1598', 'APAAR-KA-2026-900176', 'A-', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0176', 'GVS-2027-0176', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Tulsi Shetty', 'gvs-2027-0176@futureschool.edu', 'STUDENT', 'GVS-2027-0176', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0177', 'GVS-2027-0177', 'Vishal Pai', '2012-10-22', 'Male', 'class-8-b', 'Class 8', 'B', '27',
      'PAR0001', 'Mr. Tarun Pai', '9845010177', 'parent.gvs20270177@gmail.com', 'Mr. Tarun Pai', '9845010177', 'Government Officer',
      'Mrs. Malini Pai', 'Homemaker / Professional', '#1, 7th Cross, Rajajinagar, Bengaluru - 560037', 'Bengaluru Urban', 'Rajajinagar', '560003',
      '4351 8009 1621', 'APAAR-KA-2026-900177', 'B-', 'ST', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0177', 'GVS-2027-0177', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vishal Pai', 'gvs-2027-0177@futureschool.edu', 'STUDENT', 'GVS-2027-0177', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0178', 'GVS-2027-0178', 'Varsha Tripathi', '2012-01-01', 'Female', 'class-8-b', 'Class 8', 'B', '28',
      'PAR0001', 'Mr. Hemanth Tripathi', '9845010178', 'parent.gvs20270178@gmail.com', 'Mr. Hemanth Tripathi', '9845010178', 'Research Scientist',
      'Mrs. Rupa Tripathi', 'Homemaker / Professional', '#12, 9th Cross, Basavanagudi, Bengaluru - 560038', 'Bengaluru Urban', 'Basavanagudi', '560003',
      '4364 8026 1644', 'APAAR-KA-2026-900178', 'O+', 'General', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0178', 'GVS-2027-0178', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Varsha Tripathi', 'gvs-2027-0178@futureschool.edu', 'STUDENT', 'GVS-2027-0178', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0179', 'GVS-2027-0179', 'Vivek Deshmukh', '2012-04-08', 'Male', 'class-8-b', 'Class 8', 'B', '29',
      'PAR0001', 'Mr. Puneet Deshmukh', '9845010179', 'parent.gvs20270179@gmail.com', 'Mr. Puneet Deshmukh', '9845010179', 'Civil Engineer',
      'Mrs. Varsha Deshmukh', 'Homemaker / Professional', '#23, 11th Cross, HSR Layout, Bengaluru - 560039', 'Bengaluru Urban', 'HSR Layout', '560003',
      '4377 8043 1667', 'APAAR-KA-2026-900179', 'A+', 'OBC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0179', 'GVS-2027-0179', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Vivek Deshmukh', 'gvs-2027-0179@futureschool.edu', 'STUDENT', 'GVS-2027-0179', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;
INSERT INTO students (
      id, admission_number, name, dob, gender, class_id, class_name, section, roll,
      parent_account_id, parent_name, parent_mobile, parent_email, father_name, father_mobile, father_occupation,
      mother_name, mother_occupation, address, district, mandal, pincode,
      aadhaar_number, apaar_id, blood_group, caste_category, medium_of_instruction, second_language,
      fee_balance, hall_ticket_released, hall_ticket_approved, status, created_at, updated_at
    ) VALUES (
      'GVS-2027-0180', 'GVS-2027-0180', 'Anusha Rao', '2012-07-15', 'Female', 'class-8-b', 'Class 8', 'B', '30',
      'PAR0001', 'Mr. Yashas Rao', '9845010180', 'parent.gvs20270180@gmail.com', 'Mr. Yashas Rao', '9845010180', 'Software Engineer',
      'Mrs. Aadhya Rao', 'Homemaker / Professional', '#34, 1th Cross, Malleshwaram, Bengaluru - 560040', 'Bengaluru Urban', 'Malleshwaram', '560003',
      '4390 8060 1690', 'APAAR-KA-2026-900180', 'B+', 'SC', 'English', 'Kannada',
      0.0, true, true, 'Active', NOW(), NOW()
    );
INSERT INTO user_accounts (id, login_id, password, name, email, role, student_id, status, active, created_at, updated_at)
VALUES ('USR-STU-GVS-2027-0180', 'GVS-2027-0180', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Anusha Rao', 'gvs-2027-0180@futureschool.edu', 'STUDENT', 'GVS-2027-0180', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO UPDATE SET name = EXCLUDED.name, active = true;

-- Ensure Admin & Parent
INSERT INTO user_accounts (id, login_id, password, name, email, role, status, active, created_at, updated_at)
VALUES ('USR-ADM-001', 'ADM0001', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'System Administrator', 'admin@futureschool.edu', 'ADMIN', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO NOTHING;

INSERT INTO user_accounts (id, login_id, password, name, email, role, status, active, created_at, updated_at)
VALUES ('USR-PAR-001', 'PAR0001', '$2a$10$VM91KOiOqczOaOX9S.csGOPwtifm6nzMahZ4f96FUzuAx6mhrSGz.', 'Dr. Rajesh Sharma', 'rajesh.sharma@gmail.com', 'PARENT', 'Active', true, NOW(), NOW())
ON CONFLICT (login_id) DO NOTHING;

INSERT INTO parents (id, login_id, name, mobile, email, occupation, address, created_at)
VALUES ('PAR-0001', 'PAR0001', 'Dr. Rajesh Sharma', '9876543210', 'rajesh.sharma@gmail.com', 'Medical Practitioner', '#42, 4th Cross, Malleshwaram, Bengaluru - 560003', NOW())
ON CONFLICT (login_id) DO NOTHING;

COMMIT;
