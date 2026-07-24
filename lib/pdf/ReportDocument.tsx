import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { DiseaseInfo } from "@/lib/diseases";
import { URGENCY_LABEL } from "@/lib/diseases";

const INK = "#12181A";
const CLINICAL = "#1F6350";
const STONE = "#68716F";
const LINE = "#E4E7E7";
const AMBER = "#B4620A";
const RED = "#A32B2B";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10.5,
    color: INK,
    fontFamily: "Helvetica"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: INK,
    paddingBottom: 12,
    marginBottom: 18
  },
  brand: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1
  },
  brandSub: {
    fontSize: 8,
    color: STONE,
    marginTop: 2,
    letterSpacing: 1.5
  },
  metaBlock: {
    alignItems: "flex-end"
  },
  metaLine: {
    fontSize: 8.5,
    color: STONE
  },
  titleRow: {
    marginBottom: 14
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: 700
  },
  categoryLine: {
    fontSize: 9.5,
    color: STONE,
    marginTop: 3
  },
  urgencyBadge: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: 700,
    padding: "4 8",
    alignSelf: "flex-start",
    borderWidth: 1
  },
  confidenceBlock: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
    marginBottom: 4
  },
  confItem: {
    fontSize: 8.5,
    color: STONE
  },
  confValue: {
    fontSize: 11,
    fontWeight: 700,
    color: INK
  },
  photoBox: {
    marginTop: 14,
    marginBottom: 14,
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: LINE,
    objectFit: "cover"
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: CLINICAL,
    marginTop: 18,
    marginBottom: 6,
    textTransform: "uppercase"
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 1.5,
    color: INK
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
    paddingRight: 4
  },
  bullet: {
    width: 12,
    fontSize: 10.5,
    color: CLINICAL
  },
  listText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.45
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    marginTop: 16,
    marginBottom: 0
  },
  disclaimer: {
    marginTop: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: LINE,
    backgroundColor: "#F6F7F7",
    fontSize: 8.5,
    lineHeight: 1.5,
    color: STONE
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: STONE,
    borderTopWidth: 0.5,
    borderTopColor: LINE,
    paddingTop: 6
  },
  otherPredRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9.5,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: LINE
  }
});

function urgencyColor(u: DiseaseInfo["urgency"]) {
  if (u === "urgent") return RED;
  if (u === "prompt") return AMBER;
  return CLINICAL;
}

export interface ReportData {
  disease: DiseaseInfo;
  confidence: number;
  otherPredictions: { label: string; confidence: number }[];
  imageDataUrl?: string;
  generatedAt: string;
  reportId: string;
  patientNote?: string;
}

export function ReportDocument({ data }: { data: ReportData }) {
  const { disease, confidence, otherPredictions, imageDataUrl, generatedAt, reportId, patientNote } = data;
  const uColor = urgencyColor(disease.urgency);

  return (
    <Document title={`Pantheon Precision Health — ${disease.name} Report`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>PANTHEON PRECISION HEALTH</Text>
            <Text style={styles.brandSub}>AI-ASSISTED SKIN SCREENING REPORT</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLine}>Report ID: {reportId}</Text>
            <Text style={styles.metaLine}>Generated: {generatedAt}</Text>
          </View>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.diseaseTitle}>{disease.name}</Text>
          <Text style={styles.categoryLine}>{disease.category}</Text>
          <Text
            style={[
              styles.urgencyBadge,
              { color: uColor, borderColor: uColor }
            ]}
          >
            {URGENCY_LABEL[disease.urgency].toUpperCase()}
          </Text>

          <View style={styles.confidenceBlock}>
            <View>
              <Text style={styles.confItem}>MODEL CONFIDENCE</Text>
              <Text style={styles.confValue}>{(confidence * 100).toFixed(1)}%</Text>
            </View>
          </View>

          {imageDataUrl ? <Image src={imageDataUrl} style={styles.photoBox} /> : null}
        </View>

        <Text style={styles.sectionLabel}>Overview</Text>
        <Text style={styles.paragraph}>{disease.summary}</Text>

        <Text style={styles.sectionLabel}>Characteristic Features</Text>
        {disease.hallmarks.map((h, i) => (
          <View style={styles.listItem} key={i}>
            <Text style={styles.bullet}>—</Text>
            <Text style={styles.listText}>{h}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Clinical Treatment Recommendations</Text>
        {disease.treatment.map((t, i) => (
          <View style={styles.listItem} key={i}>
            <Text style={styles.bullet}>{i + 1}.</Text>
            <Text style={styles.listText}>{t}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>When To Seek Care</Text>
        <Text style={styles.paragraph}>{disease.whenToSeekCare}</Text>

        {otherPredictions.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Other Possibilities Considered</Text>
            {otherPredictions.map((p, i) => (
              <View style={styles.otherPredRow} key={i}>
                <Text>{p.label}</Text>
                <Text>{(p.confidence * 100).toFixed(1)}%</Text>
              </View>
            ))}
          </>
        ) : null}

        {patientNote ? (
          <>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.paragraph}>{patientNote}</Text>
          </>
        ) : null}

        <View style={styles.disclaimer}>
          <Text>
            This report is generated by an automated image classification model and is provided for
            informational and educational purposes only. It is not a medical diagnosis and does not
            replace evaluation by a licensed dermatologist or physician. Model predictions can be
            incorrect. Any lesion that is new, changing, bleeding, or does not heal should be evaluated
            in person by a qualified clinician, regardless of what this report indicates. If this report
            flags urgent or prompt review, please seek care promptly.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>Pantheon Precision Health — Confidential screening report</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
