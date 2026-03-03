import * as emailTemplates from './utils/emailTemplates';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const testEmail = 'deepika.agarwal@tensorgo.com';
const employeeName = 'Deepika Agarwal';
const reason = 'Testing updated leave allocation template';

async function runTest() {
    console.log(`🚀 Sending updated Leave Allocation email to ${testEmail}...`);

    const result = await emailTemplates.sendLeaveAllocationEmail(testEmail, {
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

    if (result) {
        console.log('✅ Email sent successfully!');
    } else {
        console.log('❌ Failed to send email.');
    }
    process.exit(0);
}

runTest().catch((err) => {
    console.error('❌ Unhandled error:', err);
    process.exit(1);
});
