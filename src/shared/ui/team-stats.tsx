import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { type TeamMember, TestStatus } from "@/src/shared/ui/admin-panel"

interface TeamStatsProps {
  teamMembers: TeamMember[]
}

export function TeamStats({ teamMembers }: TeamStatsProps) {
  // Calculate overall statistics
  const totalTeamMembers = teamMembers.length
  const totalTests = teamMembers.reduce((sum, member) => sum + member.testResults.total, 0)
  const totalPassed = teamMembers.reduce((sum, member) => sum + member.testResults.passed, 0)
  const totalFailed = teamMembers.reduce((sum, member) => sum + member.testResults.failed, 0)
  const totalSkipped = teamMembers.reduce((sum, member) => sum + member.testResults.skipped, 0)

  const overallSuccessRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : "0.0"

  // Status counts
  const statusCounts = {
    [TestStatus.PASSED]: teamMembers.filter((m) => m.testStatus === TestStatus.PASSED).length,
    [TestStatus.FAILED]: teamMembers.filter((m) => m.testStatus === TestStatus.FAILED).length,
    [TestStatus.RUNNING]: teamMembers.filter((m) => m.testStatus === TestStatus.RUNNING).length,
    [TestStatus.PENDING]: teamMembers.filter((m) => m.testStatus === TestStatus.PENDING).length,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeamMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              {totalPassed} passed, {totalFailed} failed, {totalSkipped} skipped
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSuccessRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Passed: {statusCounts[TestStatus.PASSED]}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span>Failed: {statusCounts[TestStatus.FAILED]}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Running: {statusCounts[TestStatus.RUNNING]}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Pending: {statusCounts[TestStatus.PENDING]}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Individual team member test performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center">
                <div className="w-1/4 font-medium truncate pr-4">{member.name}</div>
                <div className="w-3/4">
                  <div className="flex h-2 overflow-hidden rounded bg-muted">
                    {member.testResults.total > 0 ? (
                      <>
                        <div
                          className="bg-green-500"
                          style={{ width: `${(member.testResults.passed / member.testResults.total) * 100}%` }}
                        />
                        <div
                          className="bg-red-500"
                          style={{ width: `${(member.testResults.failed / member.testResults.total) * 100}%` }}
                        />
                        <div
                          className="bg-yellow-500"
                          style={{ width: `${(member.testResults.skipped / member.testResults.total) * 100}%` }}
                        />
                      </>
                    ) : (
                      <div className="bg-gray-300 w-full" />
                    )}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{member.testResults.total} tests</span>
                    <span>{member.testResults.successRate}% success rate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

