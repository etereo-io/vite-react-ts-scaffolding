import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { AllowedAuth } from "@/app/features/auth/components/AllowedAuth";
import { Title } from "@/shared/components/Title";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { TasksList } from "../components/TasksList";
import { useTasksListController } from "../hooks/useTasksListController";
import {
  DEFAULT_TASKS_FILTERS,
  PERMISSION_TASKS_WRITE_ALL
} from "../tasks.constants";
import { TASKS_ROUTES } from "../tasks.routes";

export function TasksListPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = DEFAULT_TASKS_FILTERS.limit;

  const { tasks, total, totalPages, isFetching, canDelete, handleDeleteTask } =
    useTasksListController({
      globalFilter: search,
      pagination: { pageIndex, pageSize }
    });

  const page = pageIndex + 1;

  return (
    <div className="col-span-1 md:col-span-3">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
        <Title>
          <div className="flex justify-between items-center">
            {t("tasks.page.list.title")}
            <AllowedAuth permissions={PERMISSION_TASKS_WRITE_ALL}>
              <Button asChild size="sm">
                <Link to={TASKS_ROUTES.PATTERNS.create}>
                  <Plus className="w-4 h-4" />
                  {t("tasks.actions.create")}
                </Link>
              </Button>
            </AllowedAuth>
          </div>
        </Title>

        <p className="text-sm text-muted-foreground mb-4">
          {t("tasks.page.list.description")}
        </p>

        <div className="mb-4">
          <Input
            placeholder={t("tasks.form.placeholders.title")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIndex(0);
            }}
          />
        </div>

        {isFetching && (
          <div className="text-sm text-muted-foreground mb-4">Loading...</div>
        )}

        <TasksList
          tasks={tasks}
          canDelete={canDelete}
          onDelete={(id) => handleDeleteTask(id)()}
        />

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Page {page} of {totalPages} ({total} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={pageIndex <= 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => prev + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
