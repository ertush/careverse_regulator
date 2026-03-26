import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import StatusBadge from "./StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  User,
  GraduationCap,
  Briefcase,
  Globe,
} from "lucide-react";
import { updateProfessionalApplicationStatus } from "@/api/licensingApi";
import { useLicensingStore } from "@/stores/licensingStore";
import { showSuccess, showError } from "@/utils/toast";
import type { ProfessionalLicenseApplication } from "@/types/license";

interface ProfessionalApplicationPageProps {
  application: ProfessionalLicenseApplication;
}

export default function ProfessionalApplicationPage({
  application: initialApp,
}: ProfessionalApplicationPageProps) {
  const navigate = useNavigate();
  const [application, setApplication] = useState(initialApp);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "Issued" | "Denied" | "Info Requested" | null
  >(null);

  const isPending =
    application.applicationStatus === "Pending" ||
    application.applicationStatus === "Info Requested";

  const handleSubmitAction = async () => {
    if (!selectedAction || !remarks.trim()) return;

    const status =
      selectedAction === "Info Requested" ? "Denied" : selectedAction;
    setSubmitting(selectedAction);
    try {
      await updateProfessionalApplicationStatus(
        application.licenseApplicationId,
        status as "Issued" | "Denied",
        remarks,
      );
      showSuccess(
        `Application ${selectedAction === "Issued" ? "issued" : selectedAction === "Denied" ? "denied" : "info requested"} successfully`,
      );
      useLicensingStore.getState().fetchProfessionalApplications();
      setApplication({
        ...application,
        applicationStatus:
          selectedAction === "Info Requested"
            ? "Info Requested"
            : (status as any),
      });
      setRemarks("");
      setSelectedAction(null);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to update application",
      );
    } finally {
      setSubmitting(null);
    }
  };

  const actionLabel =
    selectedAction === "Issued"
      ? "Issue License"
      : selectedAction === "Denied"
        ? "Deny Application"
        : selectedAction === "Info Requested"
          ? "Request Info"
          : "Select Action";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/license-management/applications" })}
          className="-ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Applications
        </Button>
        {isPending && selectedAction && (
          <Button
            variant={selectedAction === "Denied" ? "destructive" : "default"}
            disabled={!remarks.trim() || !!submitting}
            onClick={handleSubmitAction}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {actionLabel}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        {/* Left Sidebar */}
        <div className="space-y-3">
          {/* Entity Info */}
          <Card>
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Stethoscope className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground break-words">
                    {application.fullName || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {application.registrationNumber}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <StatusBadge status={application.applicationStatus} />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {isPending && (
            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 space-y-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                    >
                      {actionLabel}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full" align="start">
                    <DropdownMenuItem
                      onClick={() => setSelectedAction("Issued")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Issue
                      {selectedAction === "Issued" && (
                        <CheckCircle className="h-3 w-3 ml-auto text-green-600" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedAction("Denied")}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Deny
                      {selectedAction === "Denied" && (
                        <CheckCircle className="h-3 w-3 ml-auto text-green-600" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedAction("Info Requested")}
                    >
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Request Info
                      {selectedAction === "Info Requested" && (
                        <CheckCircle className="h-3 w-3 ml-auto text-green-600" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          )}

          {/* Audit Trail */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-2">
              <AuditItem
                label="Application ID"
                value={application.licenseApplicationId}
                mono
              />
              <AuditItem
                label="Application Type"
                value={application.applicationType}
              />
              <AuditItem
                label="Regulatory Body"
                value={application.regulatoryBody || "—"}
              />
              <AuditItem
                label="Application Date"
                value={application.applicationDate || "—"}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-5">
          {/* Professional Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-4 w-4" />
                Professional Details
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                See all the professional's details below
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReadOnlyField
                  label="Full Name"
                  value={application.fullName}
                  icon={User}
                />
                <ReadOnlyField
                  label="Registration Number"
                  value={application.registrationNumber}
                  mono
                />
                <ReadOnlyField
                  label="Identification Type"
                  value={application.identificationType}
                />
                <ReadOnlyField
                  label="Identification Number"
                  value={application.identificationNumber}
                  mono
                />
                <ReadOnlyField
                  label="Category of Practice"
                  value={application.categoryOfPractice}
                  icon={Briefcase}
                />
                <ReadOnlyField
                  label="Place of Practice"
                  value={application.placeOfPractice}
                  icon={GraduationCap}
                />
                <ReadOnlyField
                  label="Degree"
                  value={application.degree}
                  icon={GraduationCap}
                />
                <ReadOnlyField
                  label="Institute of Graduation"
                  value={application.instituteOfGraduation}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Professional Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Contact & Location Details
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Contact and location information
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReadOnlyField
                  label="County"
                  value={application.county}
                  icon={MapPin}
                />
                <ReadOnlyField
                  label="Country"
                  value={application.country}
                  icon={Globe}
                />
                <ReadOnlyField
                  label="Nationality"
                  value={application.nationality}
                  icon={Globe}
                />
                <ReadOnlyField
                  label="Phone Number"
                  value={application.phone}
                  icon={Phone}
                />
                <ReadOnlyField
                  label="Email Address"
                  value={application.email}
                  icon={Mail}
                />
                <ReadOnlyField
                  label="Postal Address"
                  value={application.address}
                />
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Application Details
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                See all the application details below
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReadOnlyField
                  label="License Type"
                  value={application.licenseTypeName}
                />
                <ReadOnlyField
                  label="Application Date"
                  value={application.applicationDate}
                  icon={Calendar}
                />
                <ReadOnlyField
                  label="Fee Paid"
                  value={
                    application.licenseFee
                      ? `KES ${application.licenseFee.toLocaleString()}`
                      : undefined
                  }
                  icon={DollarSign}
                />
                <ReadOnlyField
                  label="Application Type"
                  value={application.applicationType}
                />
              </div>

              {/* Compliance Documents */}
              {application.complianceDocuments &&
                application.complianceDocuments.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Accompanying Documentation
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                      {application.complianceDocuments.map(
                        (doc: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg border border-border"
                          >
                            <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-1.5">
                              <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm flex-1 truncate">
                              {doc.document_type ||
                                doc.name ||
                                `Document ${idx + 1}`}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Existing Remarks */}
          {application.remarks && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4" />
                  Comment Threads
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  See the history of comments below
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground whitespace-pre-line">
                      {application.remarks}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Comment Section */}
          {isPending && selectedAction && (
            <Card
              className={
                selectedAction === "Denied"
                  ? "border-destructive/50"
                  : selectedAction === "Info Requested"
                    ? "border-blue-500/50"
                    : "border-green-500/50"
              }
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {selectedAction === "Info Requested" ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span>Request Info License</span>
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    </>
                  ) : selectedAction === "Denied" ? (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Denial Reason</span>
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span> Approval Comments</span>
                    </>
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {selectedAction === "Info Requested"
                    ? "Describe the specific information requested for license below"
                    : selectedAction === "Denied"
                      ? "Provide the reason for denying this application"
                      : "Add any comments for this approval"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Enter Comment..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAction(null);
                      setRemarks("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={
                      selectedAction === "Denied" ? "destructive" : "default"
                    }
                    disabled={!remarks.trim() || !!submitting}
                    onClick={handleSubmitAction}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {isPending && selectedAction && (
        <div className="flex justify-end mt-5">
          <Button
            variant={selectedAction === "Denied" ? "destructive" : "default"}
            disabled={!remarks.trim() || !!submitting}
            onClick={handleSubmitAction}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
  mono,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div
        className={`mt-1 px-3 py-2 bg-muted/50 rounded-md border border-border text-sm ${mono ? "font-mono" : ""} text-foreground flex items-center gap-2`}
      >
        {Icon && (
          <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        )}
        {value || "Null"}
      </div>
    </div>
  );
}

function AuditItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}
