"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Button } from "@/src/shared/ui/button"
import { Input } from "@/src/shared/ui/input"
import { Label } from "@/src/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog"
import { Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/ui/table"
export enum TestStatus {
  PENDING = "pending",
  RUNNING = "running",
  PASSED = "passed",
  FAILED = "failed",
}

export interface TestResults {
  total: number
  passed: number
  failed: number
  skipped: number
  successRate: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  testStatus: TestStatus
  testResults: TestResults
}

interface AdminPanelProps {
  teamMembers: TeamMember[]
  onUpdateMember: (member: TeamMember) => void
  onRemoveMember: (id: string) => void
}

export function AdminPanel({ teamMembers, onUpdateMember, onRemoveMember }: AdminPanelProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "/placeholder.svg?height=40&width=40",
    testStatus: TestStatus.PENDING,
    testResults: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      successRate: 0,
    },
  })


  const handleEditMember = () => {
    if (selectedMember) {
      onUpdateMember({
        ...formData,
        id: selectedMember.id,
      } as TeamMember)
      setIsEditDialogOpen(false)
      setSelectedMember(null)
    }
  }

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      testStatus: member.testStatus,
      testResults: { ...member.testResults },
    })
    setIsEditDialogOpen(true)
  }

  const calculateSuccessRate = () => {
    const { total, passed } = formData.testResults
    if (total > 0) {
      const successRate = (passed / total) * 100
      setFormData({
        ...formData,
        testResults: {
          ...formData.testResults,
          successRate: Number.parseFloat(successRate.toFixed(1)),
        },
      })
    }
  }

  const handleTestResultChange = (field: keyof Omit<typeof formData.testResults, "successRate">, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setFormData({
      ...formData,
      testResults: {
        ...formData.testResults,
        [field]: numValue,
      },
    })

    // Update total when passed, failed, or skipped changes
    if (field !== "total") {
      const { passed, failed, skipped } = {
        ...formData.testResults,
        [field]: numValue,
      }
      const newTotal = passed + failed + skipped
      setFormData((prev) => ({
        ...prev,
        testResults: {
          ...prev.testResults,
          [field]: numValue,
          total: newTotal,
          successRate: newTotal > 0 ? Number.parseFloat(((passed / newTotal) * 100).toFixed(1)) : 0,
        },
      }))
    } else {
      // If total is changed directly, recalculate success rate
      setTimeout(calculateSuccessRate, 0)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Add, edit, or remove team members</CardDescription>
          </div>

        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${member.testStatus === TestStatus.PASSED ? "bg-green-100 text-green-800" : ""}
                      ${member.testStatus === TestStatus.FAILED ? "bg-red-100 text-red-800" : ""}
                      ${member.testStatus === TestStatus.RUNNING ? "bg-blue-100 text-blue-800" : ""}
                      ${member.testStatus === TestStatus.PENDING ? "bg-yellow-100 text-yellow-800" : ""}
                    `}
                    >
                      {member.testStatus.charAt(0).toUpperCase() + member.testStatus.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{member.testResults.total}</TableCell>
                  <TableCell>{member.testResults.successRate}%</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onRemoveMember(member.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update the details of this team member.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Test Status</Label>
              <Select
                value={formData.testStatus}
                onValueChange={(value) => setFormData({ ...formData, testStatus: value as TestStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TestStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={TestStatus.RUNNING}>Running</SelectItem>
                  <SelectItem value={TestStatus.PASSED}>Passed</SelectItem>
                  <SelectItem value={TestStatus.FAILED}>Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.testStatus !== TestStatus.PENDING && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-passed">Passed Tests</Label>
                    <Input
                      id="edit-passed"
                      type="number"
                      value={formData.testResults.passed}
                      onChange={(e) => handleTestResultChange("passed", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-failed">Failed Tests</Label>
                    <Input
                      id="edit-failed"
                      type="number"
                      value={formData.testResults.failed}
                      onChange={(e) => handleTestResultChange("failed", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-skipped">Skipped Tests</Label>
                    <Input
                      id="edit-skipped"
                      type="number"
                      value={formData.testResults.skipped}
                      onChange={(e) => handleTestResultChange("skipped", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-total">Total Tests</Label>
                    <Input
                      id="edit-total"
                      type="number"
                      value={formData.testResults.total}
                      onChange={(e) => handleTestResultChange("total", e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-successRate">Success Rate (%)</Label>
                    <Input id="edit-successRate" type="number" value={formData.testResults.successRate} disabled />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

