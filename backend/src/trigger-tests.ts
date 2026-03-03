import * as emailTemplates from './utils/emailTemplates';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const testEmail = 'manipal.segu@tensorgo.co.in';
const testReason = 'Testing mail templates';

async function runTests() {
    console.log('🚀 Starting email template tests...');

    try {
        // 1. Leave Status - Approved
        console.log('--- Sending Leave Status (Approved) ---');
        await emailTemplates.sendLeaveStatusEmail(testEmail, {
            employeeName: 'Manipal Segu',
            recipientName: 'Manipal Segu',
            recipientRole: 'employee',
            leaveType: 'casual',
            startDate: '2026-03-05',
            startType: 'full',
            endDate: '2026-03-05',
            endType: 'full',
            noOfDays: 1,
            reason: testReason, // Mentioning reason as requested
            approverName: 'HR Team',
            approverRole: 'hr',
            status: 'approved'
        });

        // 2. Leave Status - Rejected
        console.log('--- Sending Leave Status (Rejected) ---');
        await emailTemplates.sendLeaveStatusEmail(testEmail, {
            employeeName: 'Manipal Segu',
            recipientName: 'Manipal Segu',
            recipientRole: 'employee',
            leaveType: 'sick',
            startDate: '2026-03-10',
            startType: 'full',
            endDate: '2026-03-10',
            endType: 'full',
            noOfDays: 1,
            reason: testReason,
            approverName: 'HR Team',
            approverRole: 'hr',
            status: 'rejected',
            comment: 'Testing rejection template'
        });

        // 3. Leave Allocation
        console.log('--- Sending Leave Allocation ---');
        await emailTemplates.sendLeaveAllocationEmail(testEmail, {
            employeeName: 'Manipal Segu',
            leaveType: 'casual',
            allocatedDays: 5,
            previousBalance: 10,
            newBalance: 15,
            allocatedBy: 'Super Admin',
            allocationDate: '2026-03-03',
            comment: testReason
        });

        // 4. Timesheet Reminder - Daily
        console.log('--- Sending Timesheet Reminder (Daily) ---');
        await emailTemplates.sendTimesheetReminderEmail(testEmail, {
            employeeName: 'Manipal Segu',
            reminderType: 'daily',
            hoursLogged: 0,
            deadline: 'Today 7 PM'
        });

        // 5. Timesheet Reminder - Weekly Alert
        console.log('--- Sending Timesheet Reminder (Weekly Alert) ---');
        await emailTemplates.sendTimesheetReminderEmail(testEmail, {
            employeeName: 'Manipal Segu',
            reminderType: 'weekly_alert',
            hoursLogged: 32,
            deadline: 'Saturday 9 PM'
        });

        // 6. Timesheet Reminder - Criteria Not Met
        console.log('--- Sending Timesheet Reminder (Criteria Not Met) ---');
        await emailTemplates.sendTimesheetReminderEmail(testEmail, {
            employeeName: 'Manipal Segu',
            reminderType: 'criteria_not_met',
            hoursLogged: 20
        });

        // 7. Timesheet Submission (To Manager)
        console.log('--- Sending Timesheet Submission (Manager Notification) ---');
        await emailTemplates.sendTimesheetSubmissionEmail(testEmail, {
            managerName: 'Manager Name',
            employeeName: 'Manipal Segu',
            startDate: '2026-03-01',
            endDate: '2026-03-07',
            hoursLogged: 40
        });

        // 8. Weekly Timesheet Summary (To Manager)
        console.log('--- Sending Weekly Timesheet Summary ---');
        await emailTemplates.sendTimesheetSummaryEmail(testEmail, {
            managerName: 'Manager Name',
            startDate: '2026-03-01',
            endDate: '2026-03-07',
            submissions: [{ name: 'Employee A', hours: 40 }, { name: 'Employee B', hours: 42 }],
            failures: [{ name: 'Employee C', hours: 20 }]
        });

        // 9. Birthday Wish
        console.log('--- Sending Birthday Wish ---');
        await emailTemplates.sendBirthdayWishEmail(testEmail, {
            employeeName: 'Manipal Segu'
        });

        // 10. Holiday Calendar Reminder
        console.log('--- Sending Holiday Calendar Reminder ---');
        await emailTemplates.sendHolidayCalendarReminderEmail(testEmail, {
            recipientName: 'HR Team',
            nextYear: 2027
        });

        // 11. Leave Carry Forward
        console.log('--- Sending Leave Carry Forward ---');
        await emailTemplates.sendLeaveCarryForwardEmail(testEmail, {
            employeeName: 'Manipal Segu',
            previousYear: 2025,
            newYear: 2026,
            balances: {
                casual: 5,
                sick: 3,
                lop: 0
            }
        });

        console.log('✅ All test emails triggered successfully and sent to ' + testEmail);
    } catch (error) {
        console.error('❌ Error triggering test emails:', error);
    } finally {
        process.exit(0);
    }
}

runTests();
