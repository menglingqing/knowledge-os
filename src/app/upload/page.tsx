'use client'

import { useState } from 'react'
import { Upload, Link, FileText, FileArchive, ChevronDown, Settings, FileCheck } from 'lucide-react'

const processOptions = [
  { value: 'save', label: '仅保存原文', desc: '保存文档内容，不进行知识抽取' },
  { value: 'summary', label: '自动摘要', desc: '生成文档摘要和关键词' },
  { value: 'extract', label: '自动抽取知识单元', desc: '自动识别概念、方法论、案例等' },
  { value: 'graph', label: '自动生成图谱关系', desc: '抽取知识单元并建立关系连接' },
  { value: 'review', label: '进入人工审核', desc: '处理完成后进入审核队列' },
]

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState('extract')
  const [files, setFiles] = useState<File[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) setFiles((prev) => [...prev, ...dropped])
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1">知识上传</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          上传文档、网页或手动录入，系统将自动抽取和结构化知识
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`card p-12 mb-6 flex flex-col items-center justify-center border-dashed transition-all cursor-pointer ${
          dragActive ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent-glow)]' : ''
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-[color:var(--color-surface-raised)] flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-[color:var(--color-text-muted)]" />
        </div>
        <p className="text-sm font-medium mb-1">拖拽文件到此处上传</p>
        <p className="text-xs text-[color:var(--color-text-muted)] mb-4">
          支持 PDF、Word、Markdown、TXT
        </p>
        <label className="px-4 py-2 rounded-lg bg-[color:var(--color-accent)] text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity">
          选择文件
          <input type="file" multiple className="hidden" onChange={(e) => {
            if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
          }} />
        </label>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="card p-4 mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[color:var(--color-success)]" />
            已选择 {files.length} 个文件
          </h3>
          <div className="space-y-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm">
                <FileText className="w-3.5 h-3.5 text-[color:var(--color-text-muted)]" />
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-[10px] text-[color:var(--color-text-muted)]">{(f.size / 1024).toFixed(0)} KB</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Input Methods */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-4 hover:border-[color:var(--color-accent)] cursor-pointer transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[color:var(--color-surface-raised)] flex items-center justify-center">
              <Link className="w-4 h-4 text-[color:var(--color-text-secondary)]" />
            </div>
            <div>
              <p className="text-sm font-medium">网页链接</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">输入 URL 自动抓取内容</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:border-[color:var(--color-accent)] cursor-pointer transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[color:var(--color-surface-raised)] flex items-center justify-center">
              <FileArchive className="w-4 h-4 text-[color:var(--color-text-secondary)]" />
            </div>
            <div>
              <p className="text-sm font-medium">手动录入</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">直接粘贴或编写文本内容</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Options */}
      <div className="card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-[color:var(--color-text-muted)]" />
          处理方式
        </h3>
        <div className="space-y-2">
          {processOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                selectedProcess === opt.value
                  ? 'bg-[color:var(--color-accent-glow)] border border-[rgba(108,140,255,0.3)]'
                  : 'bg-[color:var(--color-surface-raised)] border border-transparent hover:border-[color:var(--color-border)]'
              }`}
            >
              <input
                type="radio"
                name="process"
                value={opt.value}
                checked={selectedProcess === opt.value}
                onChange={() => setSelectedProcess(opt.value)}
                className="mt-0.5 accent-[var(--color-accent)]"
              />
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-[color:var(--color-text-muted)]">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button className="w-full py-2.5 rounded-lg bg-[color:var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
        开始处理
      </button>
    </div>
  )
}
