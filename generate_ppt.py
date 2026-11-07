import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_NAVY = RGBColor(15, 23, 42)      # #0F172A
    C_BLUE = RGBColor(37, 99, 235)     # #2563EB
    C_LIGHT_BLUE = RGBColor(239, 246, 255) # #EFF6FF
    C_TEAL = RGBColor(13, 148, 136)    # #0D9488
    C_LIGHT_TEAL = RGBColor(240, 253, 250)
    C_GREEN = RGBColor(16, 185, 129)   # #10B981
    C_LIGHT_GREEN = RGBColor(236, 253, 245)
    C_AMBER = RGBColor(245, 158, 11)   # #F59E0B
    C_LIGHT_AMBER = RGBColor(254, 243, 199)
    C_PURPLE = RGBColor(139, 92, 246)  # #8B5CF6
    C_LIGHT_PURPLE = RGBColor(245, 243, 255)
    C_WHITE = RGBColor(255, 255, 255)
    C_GRAY = RGBColor(100, 116, 139)   # #64748B
    C_DARK = RGBColor(30, 41, 59)      # #1E293B
    C_BORDER = RGBColor(226, 232, 240) # #E2E8F0

    def add_header(slide, title, subtitle):
        # Header banner
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.0))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = C_NAVY

        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.size = Pt(13)
            p2.font.color.rgb = C_GRAY
            p2.space_before = Pt(4)

    def add_card(slide, left, top, width, height, title, items, bg_color=C_WHITE, border_color=C_BORDER, title_color=C_BLUE):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.2)
        tf.margin_bottom = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = title_color
        p.space_after = Pt(8)

        for item in items:
            pi = tf.add_paragraph()
            pi.text = "• " + item
            pi.font.size = Pt(11)
            pi.font.color.rgb = C_DARK
            pi.space_before = Pt(3)

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY
    bg1.line.fill.background()

    tb = slide1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "FutureSchool High School Management System"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Complete End-to-End Feature Architecture & System Connection Diagram"
    p2.font.size = Pt(20)
    p2.font.color.rgb = RGBColor(147, 197, 253)
    p2.space_before = Pt(12)

    p3 = tf.add_paragraph()
    p3.text = "React 18 Frontend  •  Spring Boot 3 Backend (Port 5000)  •  PostgreSQL 17 Database (24 Relational Tables)"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(203, 213, 225)
    p3.space_before = Pt(24)

    p4 = tf.add_paragraph()
    p4.text = "Covers: Multi-Tenancy Roles (Admin, Principal, Teacher, Parent, Student)  |  Sibling Switcher  |  Academics  |  Finance"
    p4.font.size = Pt(12)
    p4.font.color.rgb = RGBColor(148, 163, 184)
    p4.space_before = Pt(8)

    # ==========================================
    # SLIDE 2: 4 Core Functional Hubs
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "1. Executive Overview: The 4 Interconnected Core Hubs",
               "Every module in FutureSchool belongs to one of four interconnected functional clusters.")

    # 4 Hub Cards
    add_card(slide2, Inches(0.8), Inches(1.6), Inches(2.75), Inches(5.2),
             "👥 People & Identity Hub",
             [
                 "Student Admissions & Profiles",
                 "Class Rosters & Enrollment",
                 "Parent Account Management",
                 "Multi-Child Sibling Switcher",
                 "Teacher & Faculty Directory",
                 "Role-Based Access (5 Roles)",
                 "User Credentials & BCrypt",
                 "Transfer / Exit Records"
             ],
             C_LIGHT_BLUE, C_BLUE, C_BLUE)

    add_card(slide2, Inches(3.8), Inches(1.6), Inches(2.75), Inches(5.2),
             "📚 Academics & Grading Hub",
             [
                 "Classes, Grades & Sections",
                 "Subject & Teacher Allocation",
                 "Daily Student Attendance",
                 "Homework Assignments",
                 "Study Notes & Syllabus Docs",
                 "Hall Tickets (Admit Cards)",
                 "Exam Marks (Draft->Verify->Publish)",
                 "Batch Student Promotion"
             ],
             C_LIGHT_TEAL, C_TEAL, C_TEAL)

    add_card(slide2, Inches(6.8), Inches(1.6), Inches(2.75), Inches(5.2),
             "💳 Administration & Finance",
             [
                 "Fee Head Setup & Assigning",
                 "Fee Collection (Cash/UPI/Card)",
                 "Instant Official Receipts",
                 "Auto-Deducted Balance Tracking",
                 "Fee Overdue & Defaulters List",
                 "Staff / Teacher Daily Attendance",
                 "Bonafide & TC Certificates",
                 "School Profile & Config"
             ],
             C_LIGHT_GREEN, C_GREEN, C_GREEN)

    add_card(slide2, Inches(9.8), Inches(1.6), Inches(2.75), Inches(5.2),
             "🚌 Operations & Support",
             [
                 "Class & Teacher Timetables",
                 "Library Books & Borrow/Return",
                 "Transport Bus Routes & Stops",
                 "School Calendar & Holidays",
                 "PTM Meetings Scheduling",
                 "Grievance / Complaint Tickets",
                 "Circulars & Notice Board",
                 "Online Interactive Quizzes"
             ],
             C_LIGHT_PURPLE, C_PURPLE, C_PURPLE)

    # ==========================================
    # SLIDE 3: Central Master Connection Diagram
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "2. Master Connection Map: How All Features Connect",
               "The Student is the central node connecting Identity, Academics, Finance, Transport, and Family accounts.")

    # Center Box: Student Entity
    center = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.0), Inches(2.8), Inches(3.3), Inches(2.0))
    center.fill.solid()
    center.fill.fore_color.rgb = C_BLUE
    center.line.color.rgb = C_NAVY
    center.line.width = Pt(2)
    ctf = center.text_frame
    ctf.word_wrap = True
    cp = ctf.paragraphs[0]
    cp.text = "STUDENT ENTITY\n(Central Master Record)"
    cp.font.size = Pt(16)
    cp.font.bold = True
    cp.font.color.rgb = C_WHITE
    cp.alignment = PP_ALIGN.CENTER
    cp2 = ctf.add_paragraph()
    cp2.text = "ID: STU0001 | Admission No | Class | Parent"
    cp2.font.size = Pt(11)
    cp2.font.color.rgb = RGBColor(219, 234, 254)
    cp2.alignment = PP_ALIGN.CENTER

    # Orbiting Modules
    modules = [
        ("👨‍👩‍👧 Parent Account\n(PAR0001 Sibling Link)", Inches(0.8), Inches(1.6), C_LIGHT_AMBER, C_AMBER),
        ("🏫 School Class\n(10-A, 10-B, 9-A, etc.)", Inches(0.8), Inches(3.7), C_LIGHT_BLUE, C_BLUE),
        ("📅 Daily Attendance\n(Present / Absent / Late)", Inches(0.8), Inches(5.6), C_LIGHT_TEAL, C_TEAL),

        ("🎟️ Exam Hall Ticket\n(Released & Approved)", Inches(5.0), Inches(1.5), C_LIGHT_PURPLE, C_PURPLE),
        ("📜 Certificates\n(Bonafide, TC, Character)", Inches(5.0), Inches(5.4), C_LIGHT_PURPLE, C_PURPLE),

        ("💳 Fee Balance & Receipts\n(Auto-Deductions)", Inches(9.2), Inches(1.6), C_LIGHT_GREEN, C_GREEN),
        ("📝 Exam Marks & Grades\n(Draft -> Verified -> Published)", Inches(9.2), Inches(3.7), C_LIGHT_TEAL, C_TEAL),
        ("🚌 Transport & Library\n(Route Allocation & Books)", Inches(9.2), Inches(5.6), C_LIGHT_AMBER, C_AMBER)
    ]

    for title, left, top, bg, border in modules:
        sh = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.3), Inches(1.4))
        sh.fill.solid()
        sh.fill.fore_color.rgb = bg
        sh.line.color.rgb = border
        sh.line.width = Pt(1.5)
        stf = sh.text_frame
        stf.word_wrap = True
        stp = stf.paragraphs[0]
        stp.text = title
        stp.font.size = Pt(12)
        stp.font.bold = True
        stp.font.color.rgb = C_DARK
        stp.alignment = PP_ALIGN.CENTER

    # ==========================================
    # SLIDE 4: Academic & Exam Lifecycle Flow
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "3. Academic & Examination Lifecycle Data Flow",
               "Chronological data pipeline from admissions and teaching to exam verification and progression.")

    steps = [
        ("Step 1: Setup & Allocations", "Admin creates Classes (10-A)\nAssigns Teacher & Subjects\nDefines Academic Year 2026-27", C_BLUE),
        ("Step 2: Daily Operations", "Teacher marks attendance daily\nAssigns Homework with deadlines\nUploads syllabus & study materials", C_TEAL),
        ("Step 3: Exam Clearance", "Admin & Principal inspect fees\nApproves & Releases Hall Tickets\nStudents download admit cards", C_AMBER),
        ("Step 4: Marks Verification", "Teacher inputs exam scores (Draft)\nPrincipal reviews & verifies scores\nPublished to Parents & Students", C_PURPLE),
        ("Step 5: Report Card & Promotion", "Automated digital grade reports\nAdmin runs Batch Promotion\nUnenrolled students receive TC", C_GREEN)
    ]

    left = Inches(0.8)
    for title, desc, color in steps:
        box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.2), Inches(2.2), Inches(4.2))
        box.fill.solid()
        box.fill.fore_color.rgb = C_WHITE
        box.line.color.rgb = color
        box.line.width = Pt(2)
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = btf.margin_right = btf.margin_top = Inches(0.15)
        
        bp = btf.paragraphs[0]
        bp.text = title
        bp.font.size = Pt(13)
        bp.font.bold = True
        bp.font.color.rgb = color
        bp.space_after = Pt(10)
        
        bp2 = btf.add_paragraph()
        bp2.text = desc
        bp2.font.size = Pt(11)
        bp2.font.color.rgb = C_DARK

        left += Inches(2.4)

    # ==========================================
    # SLIDE 5: Parent Sibling Switcher Architecture
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "4. Multi-Child / Sibling Architecture for Parents",
               "How a single parent account seamlessly monitors multiple children in different grades.")

    # Parent Account Box
    p_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.4), Inches(3.6), Inches(4.2))
    p_box.fill.solid()
    p_box.fill.fore_color.rgb = C_LIGHT_AMBER
    p_box.line.color.rgb = C_AMBER
    p_box.line.width = Pt(2)
    ptf = p_box.text_frame
    ptf.word_wrap = True
    pp = ptf.paragraphs[0]
    pp.text = "👨‍👩‍👧 Parent Login Account"
    pp.font.size = Pt(16)
    pp.font.bold = True
    pp.font.color.rgb = C_AMBER
    pp.space_after = Pt(12)

    p_items = [
        "Login ID: PAR0001",
        "Parent: Sanjay Verma",
        "Role: PARENT",
        "Single Login Credentials",
        "Has 'linkedStudentIds':\n  • STU0001 (Child 1)\n  • STU0101 (Child 2)",
        "Dropdown Pill in Header\nallows 1-click ward switching!"
    ]
    for it in p_items:
        pi = ptf.add_paragraph()
        pi.text = "• " + it
        pi.font.size = Pt(12)
        pi.font.color.rgb = C_DARK
        pi.space_before = Pt(4)

    # Child 1 Card
    c1_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.0), Inches(2.4), Inches(3.6), Inches(4.2))
    c1_box.fill.solid()
    c1_box.fill.fore_color.rgb = C_LIGHT_BLUE
    c1_box.line.color.rgb = C_BLUE
    c1_box.line.width = Pt(1.5)
    c1tf = c1_box.text_frame
    c1tf.word_wrap = True
    c1p = c1tf.paragraphs[0]
    c1p.text = "Child 1: Aarav Verma"
    c1p.font.size = Pt(15)
    c1p.font.bold = True
    c1p.font.color.rgb = C_BLUE
    c1p.space_after = Pt(8)

    c1_items = [
        "Student ID: STU0001",
        "Class: Class 10 - Section A",
        "Class Teacher: Rajesh Kumar",
        "Roll No: 01",
        "Attendance: 96% Present",
        "Term 1 Exam: 94.5% (A+)",
        "Fee Balance: Rs. 15,000",
        "Timetable: Class 10 Schedule"
    ]
    for it in c1_items:
        pi = c1tf.add_paragraph()
        pi.text = "• " + it
        pi.font.size = Pt(11)
        pi.font.color.rgb = C_DARK
        pi.space_before = Pt(3)

    # Child 2 Card
    c2_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.0), Inches(2.4), Inches(3.6), Inches(4.2))
    c2_box.fill.solid()
    c2_box.fill.fore_color.rgb = C_LIGHT_TEAL
    c2_box.line.color.rgb = C_TEAL
    c2_box.line.width = Pt(1.5)
    c2tf = c2_box.text_frame
    c2tf.word_wrap = True
    c2p = c2tf.paragraphs[0]
    c2p.text = "Child 2: Ananya Verma"
    c2p.font.size = Pt(15)
    c2p.font.bold = True
    c2p.font.color.rgb = C_TEAL
    c2p.space_after = Pt(8)

    c2_items = [
        "Student ID: STU0101",
        "Class: Class 8 - Section A",
        "Class Teacher: Amit Trivedi",
        "Roll No: 01",
        "Attendance: 98% Present",
        "Term 1 Exam: 91.0% (A+)",
        "Fee Balance: Rs. 20,000",
        "Timetable: Class 8 Schedule"
    ]
    for it in c2_items:
        pi = c2tf.add_paragraph()
        pi.text = "• " + it
        pi.font.size = Pt(11)
        pi.font.color.rgb = C_DARK
        pi.space_before = Pt(3)

    # ==========================================
    # SLIDE 6: Financial & Fee Engine Flow
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "5. Financial Engine & Fee Collection Data Flow",
               "Automated balance reconciliation, payment recording, and official receipt generation.")

    f_steps = [
        ("1. Fee Head Structure", "Admin defines fee heads:\n• Tuition Fee: Rs. 25,000\n• Transport Fee: Rs. 8,000\n• Lab/Exam Fee: Rs. 4,000", C_BLUE),
        ("2. Balance Invoicing", "Fee is invoiced to student:\nstudent.feeBalance = Rs. 25,000\nPOST /api/fees/assign", C_PURPLE),
        ("3. Cashier Payment", "Cashier collects payment via:\n• Cash, UPI, Card, NetBanking\nPOST /api/fees/collect", C_AMBER),
        ("4. Auto-Reconciliation", "Backend generates official receipt:\n• Receipt No: REC-2026-0001\n• Deducts balance: Rs. 10,000", C_GREEN),
        ("5. Defaulter Tracking", "Instant real-time report:\nGET /api/fees/overdue\nShows all students with dues", C_NAVY)
    ]

    f_left = Inches(0.8)
    for title, desc, color in f_steps:
        box = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, f_left, Inches(2.2), Inches(2.2), Inches(4.2))
        box.fill.solid()
        box.fill.fore_color.rgb = C_WHITE
        box.line.color.rgb = color
        box.line.width = Pt(2)
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = btf.margin_right = btf.margin_top = Inches(0.15)
        
        bp = btf.paragraphs[0]
        bp.text = title
        bp.font.size = Pt(13)
        bp.font.bold = True
        bp.font.color.rgb = color
        bp.space_after = Pt(10)
        
        bp2 = btf.add_paragraph()
        bp2.text = desc
        bp2.font.size = Pt(11)
        bp2.font.color.rgb = C_DARK

        f_left += Inches(2.4)

    # ==========================================
    # SLIDE 7: Full 3-Tier Technical Topology
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "6. Full Three-Tier Technical Stack Architecture",
               "Production-grade separation of concerns with React, Spring Boot, and PostgreSQL.")

    # Tier 1 Card
    add_card(slide7, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Tier 1: Client Layer (SPA)",
             [
                 "React 18.3 + TypeScript",
                 "Vite Fast Build Tool",
                 "Tailwind CSS Design System",
                 "Lucide React Icon Library",
                 "React Router v6 Navigation",
                 "AuthContext Session Store",
                 "Multi-Child Switcher Context",
                 "Stateless JWT Bearer Storage",
                 "Running on Port 3000"
             ],
             C_LIGHT_BLUE, C_BLUE, C_BLUE)

    # Tier 2 Card
    add_card(slide7, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Tier 2: Backend REST APIs",
             [
                 "Spring Boot 3.3.4 (Java 17 LTS)",
                 "Spring Security 6 (Stateless)",
                 "JJWT 0.12.5 Token Engine",
                 "Spring Data JPA / Hibernate",
                 "24 REST API Controllers",
                 "HikariCP Connection Pool",
                 "BCrypt Password Encryption",
                 "Swagger OpenAPI 3 (Port 5000)",
                 "CORS Pre-Flight Configuration"
             ],
             C_LIGHT_GREEN, C_GREEN, C_GREEN)

    # Tier 3 Card
    add_card(slide7, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Tier 3: Database Engine",
             [
                 "PostgreSQL 17 Relational DB",
                 "Port 5432 (Database: futureschool)",
                 "24 Relational Master Tables",
                 "Foreign Key & Index Enforcements",
                 "ACID Compliant Transactions",
                 "Stateless Relational Mapping",
                 "Superuser: postgres",
                 "Automated Schema Auto-DDL",
                 "Real Data Storage"
             ],
             C_LIGHT_AMBER, C_AMBER, C_AMBER)

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    out = "D:\\Student Management\\FutureSchool_Complete_Feature_Architecture.pptx"
    create_deck(out)
