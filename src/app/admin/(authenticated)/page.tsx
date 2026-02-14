import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

export const metadata: Metadata = {
  title: "ダッシュボード",
};

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">管理画面ダッシュボード</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>イベント管理</CardTitle>
            <CardDescription>
              イベントの作成、編集、削除を行います
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/events" className="text-primary hover:underline">
              イベント一覧へ →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>管理者一覧</CardTitle>
            <CardDescription>
              管理者の確認、追加、削除を行います
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/admins" className="text-primary hover:underline">
              管理者一覧へ →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>パスワード変更</CardTitle>
            <CardDescription>自分のパスワードを変更します</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="admin/settings/change-password"
              className="text-primary hover:underline"
            >
              パスワード変更へ →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
