import * as emailTemplates from './utils/emailTemplates';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const testEmail = 'deepika.agarwal@tensorgo.com';
const employeeName = 'Deepika Agarwal';
const reason = 'Testing';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    console.log(`🚀 Sending all emails to ${testEmail}...`);
    let sent = 0;
    let failed = 0;

    // 1. Password Reset OTP
    console.log('\n[1] Password Reset OTP');
    const r1 = await emailTemplates.sendPasswordResetEmail(testEmail, {
        userName: employeeName,
        otp: '123456'
    });
    r1 ? sent++ : failed++;
    await sleep(500);

    // 2. Leave Application Notification (to Manager)
    console.log('[2] Leave Application Notification');
    const r2 = await emailTemplates.sendLeaveApplicationEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        managerName: employeeName,
        leaveType: 'casual',
        startDate: '2026-03-10',
        startType: 'full',
        endDate: '2026-03-10',
        endType: 'full',
        noOfDays: 1,
        reason,
        appliedDate: '2026-03-03'
    });
    r2 ? sent++ : failed++;
    await sleep(500);

    // 3. Leave Status – Approved
    console.log('[3] Leave Status – Approved');
    const r3 = await emailTemplates.sendLeaveStatusEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        recipientName: employeeName,
        recipientRole: 'employee',
        leaveType: 'casual',
        startDate: '2026-03-10',
        startType: 'full',
        endDate: '2026-03-10',
        endType: 'full',
        noOfDays: 1,
        reason,
        approverName: 'HR Team',
        approverEmpId: 'TG000',
        approverRole: 'hr',
        status: 'approved'
    });
    r3 ? sent++ : failed++;
    await sleep(500);

    // 4. Leave Status – Rejected
    console.log('[4] Leave Status – Rejected');
    const r4 = await emailTemplates.sendLeaveStatusEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        recipientName: employeeName,
        recipientRole: 'employee',
        leaveType: 'sick',
        startDate: '2026-03-11',
        startType: 'full',
        endDate: '2026-03-11',
        endType: 'full',
        noOfDays: 1,
        reason,
        approverName: 'HR Team',
        approverEmpId: 'TG000',
        approverRole: 'hr',
        status: 'rejected',
        comment: reason
    });
    r4 ? sent++ : failed++;
    await sleep(500);

    // 5. New Employee Credentials
    console.log('[5] New Employee Credentials');
    const r5 = await emailTemplates.sendNewEmployeeCredentialsEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        email: testEmail,
        role: 'Employee',
        temporaryPassword: 'TempPass@123',
        loginUrl: 'https://intra.tensorgo.com'
    });
    r5 ? sent++ : failed++;
    await sleep(500);

    // 6. Leave Allocation (Employee)
    console.log('[6] Leave Allocation (Employee)');
    const r6 = await emailTemplates.sendLeaveAllocationEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        leaveType: 'casual',
        allocatedDays: 5,
        previousBalance: 10,
        newBalance: 15,
        allocatedBy: 'HR Team',
        allocationDate: '2026-03-03',
        comment: reason
    });
    r6 ? sent++ : failed++;
    await sleep(500);

    // 7. Leave Allocation Alert (Super Admin / Admin)
    console.log('[7] Leave Allocation Alert – Administrative Notification');
    const r7 = await emailTemplates.sendSuperAdminLeaveAllocationEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        leaveType: 'casual',
        allocatedDays: 5,
        previousBalance: 10,
        newBalance: 15,
        allocatedBy: 'HR Team',
        allocationDate: '2026-03-03',
        adminName: employeeName,
        comment: reason
    });
    r7 ? sent++ : failed++;
    await sleep(500);

    // 8. Password Change Security Alert
    console.log('[8] Password Change Security Alert');
    const r8 = await emailTemplates.sendPasswordChangeSecurityEmail(testEmail, {
        userName: employeeName,
        changeTimestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1'
    });
    r8 ? sent++ : failed++;
    await sleep(500);

    // 9. Pending Leave Reminder (to Manager)
    console.log('[9] Pending Leave Reminder');
    const r9 = await emailTemplates.sendPendingLeaveReminderEmail(testEmail, {
        managerName: employeeName,
        pendingLeaves: [
            {
                employeeName: 'Test Employee',
                employeeEmpId: 'TG002',
                leaveType: 'casual',
                startDate: '2026-03-05',
                endDate: '2026-03-05',
                noOfDays: 1,
                appliedDate: '2026-03-01',
                daysPending: 2
            }
        ]
    });
    r9 ? sent++ : failed++;
    await sleep(500);

    // 10. Birthday Wish
    console.log('[10] Birthday Greetings');
    const r10 = await emailTemplates.sendBirthdayWishEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001'
    });
    r10 ? sent++ : failed++;
    await sleep(500);

    // 11. Leave Carry Forward
    console.log('[11] Leave Carry Forward Update');
    const r11 = await emailTemplates.sendLeaveCarryForwardEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        previousYear: 2025,
        newYear: 2026,
        carriedForwardLeaves: { casual: 2, sick: 1 },
        newYearBalances: { casual: 14, sick: 7, lop: 0 }
    });
    r11 ? sent++ : failed++;
    await sleep(500);

    // 12. Urgent Leave Application (to Manager)
    console.log('[12] Urgent Leave Application');
    const r12 = await emailTemplates.sendUrgentLeaveApplicationEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        managerName: employeeName,
        leaveType: 'casual',
        startDate: '2026-03-04',
        startType: 'full',
        endDate: '2026-03-04',
        endType: 'full',
        noOfDays: 1,
        reason,
        appliedDate: '2026-03-03'
    });
    r12 ? sent++ : failed++;
    await sleep(500);

    // 13. Employee Details Update
    console.log('[13] Profile Update Notification');
    const r13 = await emailTemplates.sendEmployeeDetailsUpdateEmail(testEmail, {
        employeeName,
        employeeEmpId: 'TG001',
        updatedBy: 'HR Team'
    });
    r13 ? sent++ : failed++;
    await sleep(500);

    // 14. Holiday Calendar Reminder
    console.log('[14] Holiday Calendar Reminder');
    const r14 = await emailTemplates.sendHolidayCalendarReminderEmail(testEmail, {
        recipientName: employeeName,
        nextYear: 2027
    });
    r14 ? sent++ : failed++;
    await sleep(500);

    // 15. Timesheet Status – Approved
    console.log('[15] Timesheet Approved – Confirmation');
    const r15 = await emailTemplates.sendTimesheetApprovedEmail(testEmail, {
        employeeName,
        status: 'approved',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        approverName: 'Manager Name'
    });
    r15 ? sent++ : failed++;
    await sleep(500);

    // 16. Timesheet Status – Rejected
    console.log('[16] Timesheet Rejected – Action Required');
    const r16 = await emailTemplates.sendTimesheetRejectedEmail(testEmail, {
        employeeName,
        status: 'rejected',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        logDate: '2026-03-03',
        reason,
        approverName: 'Manager Name'
    });
    r16 ? sent++ : failed++;
    await sleep(500);

    // 17. Timesheet Reminder – Daily
    console.log('[17] Timesheet Reminder – Daily');
    const r17 = await emailTemplates.sendTimesheetReminderEmail(testEmail, {
        employeeName,
        reminderType: 'daily',
        date: '2026-03-03'
    });
    r17 ? sent++ : failed++;
    await sleep(500);

    // 18. Timesheet Reminder – Friday/Weekly Alert
    console.log('[18] Timesheet Alert – Weekly Hours Below Threshold');
    const r18 = await emailTemplates.sendTimesheetReminderEmail(testEmail, {
        employeeName,
        reminderType: 'friday_alert',
        hoursLogged: 30
    });
    r18 ? sent++ : failed++;
    await sleep(500);

    // 19. Timesheet Reminder – Criteria Not Met
    console.log('[19] Timesheet Criteria Not Met');
    const r19 = await emailTemplates.sendTimesheetReminderEmail(testEmail, {
        employeeName,
        reminderType: 'criteria_not_met',
        hoursLogged: 15
    });
    r19 ? sent++ : failed++;
    await sleep(500);

    // 20. Timesheet Submission (to Manager)
    console.log('[20] Timesheet Submitted – Review Required');
    const r20 = await emailTemplates.sendTimesheetSubmissionEmail(testEmail, {
        managerName: employeeName,
        employeeName: 'Test Employee',
        hoursLogged: 40,
        startDate: '2026-03-01',
        endDate: '2026-03-07'
    });
    r20 ? sent++ : failed++;
    await sleep(500);

    // 21. Weekly Timesheet Summary (to Manager)
    console.log('[21] Weekly Timesheet Summary – Team Status Report');
    const r21 = await emailTemplates.sendTimesheetSummaryEmail(testEmail, {
        managerName: employeeName,
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        submissions: [{ name: 'Employee A', hours: 40 }, { name: 'Employee B', hours: 42 }],
        failures: [{ name: 'Employee C', hours: 20 }]
    });
    r21 ? sent++ : failed++;
    await sleep(500);

    // 22. Role Update Notification
    console.log('[22] Role Update Notification');
    const r22 = await emailTemplates.sendRoleUpdateEmail(testEmail, {
        employeeName,
        newRole: 'Manager',
        effectiveDate: '2026-03-03',
        updatedBy: 'HR Team'
    });
    r22 ? sent++ : failed++;
    await sleep(500);

    // 23. Employment Status Update Notification
    console.log('[23] Employment Status Update Notification');
    const r23 = await emailTemplates.sendStatusUpdateEmail(testEmail, {
        employeeName,
        newStatus: 'Active',
        effectiveDate: '2026-03-03',
        updatedBy: 'HR Team'
    });
    r23 ? sent++ : failed++;
    await sleep(500);

    // 24. Reporting Manager Update
    console.log('[24] Reporting Manager Updated');
    const r24 = await emailTemplates.sendReportingManagerUpdateEmail(testEmail, {
        employeeName,
        managerName: 'Manager Name',
        managerId: 'TG010'
    });
    r24 ? sent++ : failed++;

    console.log(`\n✅ Done! ${sent} sent, ${failed} failed out of 24 total.`);
    process.exit(0);
}

runTests().catch((err) => {
    console.error('❌ Unhandled error:', err);
    process.exit(1);
});
