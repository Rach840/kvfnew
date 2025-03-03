import { Card, CardContent } from "@/src/shared/ui/card"
import { type TeamMember, TestStatus } from "@/src/shared/ui/admin-panel"
import { Badge } from "@/src/shared/ui/badge"
import { Progress } from "@/src/shared/ui/progress"
import { CheckCircle2, Clock, Users } from "lucide-react"

interface TeamMembersListProps {
  teamMembers: TeamMember[]
}

export function TeamMembersList({ teamMembers }: TeamMembersListProps) {
  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case true:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case true:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Пройден</Badge>
      default:
        return  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Ожидание</Badge>
    }
  }
const membersMap = teamMembers.map((member) => {
  const memberScore = member?.testResult?.answerHistory.reduce((acc, item) => acc + item.questionScore, 0);


  return {
    ...member,
    testScore: memberScore
  }
})
  console.log(membersMap)
  return (
      <div className="container mx-auto py-8 px-4">

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {membersMap.map((member) => (
        <Card key={member.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">

                <div>
                  <h3 className="font-medium">{member.firstName} {member.lastName} {member.surName}</h3>
                  <p className="text-sm text-muted-foreground">{member.memberRole == 'SUPERVISOR' ? 'Руководитель' :  member.memberRole == "CAPTAIN" ? 'Капитан' : 'Участник'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(member.testPassed)}
                  <span className="text-sm font-medium">Статус теста:</span>
                  {getStatusBadge(member.testPassed)}
                </div>
              </div>

              {member.testPassed && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Результаты тестирования</span>
                      <span className="font-medium">{(member.testResult.score / member.testScore) * 100}%</span>
                    </div>
                    <Progress  value={(member.testResult.score / member.testScore) * 100}  className=" h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-md bg-muted p-2">
                      <div className="font-medium">{member.testScore}</div>
                      <div className="text-xs text-muted-foreground">Всего баллов в тесте</div>
                    </div>
                    <div className="rounded-md bg-green-100 p-2">
                      <div className="font-medium text-green-800">{member.testResult.score}</div>
                      <div className="text-xs text-green-800/80">Баллов набрано</div>
                    </div>
                    <div className="rounded-md bg-red-100 p-2">
                      <div className="font-medium text-red-800">{member.testScore - member.testResult.score}</div>
                      <div className="text-xs text-red-800/80">Упущенные баллы</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
      </div>
  )
}

