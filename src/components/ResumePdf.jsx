import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },

  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    fontSize: 9.5,
    color: "#374151",
  },
  contactItem: {
    marginHorizontal: 4,
  },
  address: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 4,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginTop: 4,
    marginBottom: 12,
  },

  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },

  entry: {
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  meta: {
    fontSize: 9.5,
    color: "#4b5563",
  },
  description: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 1.4,
  },
  technologies: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#6b7280",
    marginTop: 3,
  },
  link: {
    fontSize: 9,
    color: "#2563eb",
    textDecoration: "underline",
    marginTop: 3,
  },

  bulletRow: {
    flexDirection: "row",
    marginTop: 3,
    marginLeft: 8,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.8,
    lineHeight: 1.4,
  },
});

export const ResumePDF = ({ formData }) => {
  const experienceList = Array.isArray(formData.experience) ? formData.experience : [];
  const educationList = Array.isArray(formData.education) ? formData.education : [];
  const projectList = Array.isArray(formData.projects) ? formData.projects : [];
  const certificationList = Array.isArray(formData.certifications)
    ? formData.certifications
    : [];

  const languagesText =
    typeof formData.languages === "string"
      ? formData.languages
      : Array.isArray(formData.languages)
      ? formData.languages.join(", ")
      : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{formData.name || "Your Name"}</Text>

          <View style={styles.contactRow}>
            {formData.email ? (
              <Text style={styles.contactItem}>{formData.email}</Text>
            ) : null}

            {formData.email && formData.phone ? <Text>|</Text> : null}

            {formData.phone ? (
              <Text style={styles.contactItem}>{formData.phone}</Text>
            ) : null}

            {(formData.email || formData.phone) && formData.linkedIn ? <Text>|</Text> : null}

            {formData.linkedIn ? (
              <Link src={formData.linkedIn} style={styles.contactItem}>
                LinkedIn
              </Link>
            ) : null}

            {(formData.email || formData.phone || formData.linkedIn) && formData.github ? (
              <Text>|</Text>
            ) : null}

            {formData.github ? (
              <Link src={formData.github} style={styles.contactItem}>
                GitHub
              </Link>
            ) : null}
          </View>

          {formData.address ? (
            <Text style={styles.address}>{formData.address}</Text>
          ) : null}
        </View>

        <View style={styles.divider} />

        {/* EDUCATION */}
        {educationList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.divider} />

            {educationList.map((edu, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleBold}>{edu.institution || ""}</Text>
                  <Text style={styles.meta}>{edu.year || ""}</Text>
                </View>

                <View style={styles.rowBetween}>
                  <Text style={styles.text}>{edu.degree || ""}</Text>
                  {edu.cgpa ? <Text style={styles.meta}>CGPA: {edu.cgpa}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {projectList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.divider} />

            {projectList.map((project, i) => (
              <View key={i} style={styles.entry}>
                <Text style={styles.titleBold}>{project.title || ""}</Text>

                {project.description ? (
                  <Text style={styles.description}>{project.description}</Text>
                ) : null}

                {project.technologies ? (
                  <Text style={styles.technologies}>
                    Technologies: {project.technologies}
                  </Text>
                ) : null}

                {project.link ? (
                  <Link src={project.link} style={styles.link}>
                    Project Link
                  </Link>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* EXPERIENCE */}
        {experienceList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.divider} />

            {experienceList.map((exp, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleBold}>{exp.company || ""}</Text>
                  <Text style={styles.meta}>{exp.duration || ""}</Text>
                </View>

                {exp.role ? <Text style={styles.text}>{exp.role}</Text> : null}

                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
                  ? exp.responsibilities.map((resp, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{resp}</Text>
                      </View>
                    ))
                  : exp.responsibilities
                  ? (
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{exp.responsibilities}</Text>
                    </View>
                  )
                  : null}
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {(formData.skills || languagesText) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.divider} />

            {formData.skills ? (
              <Text style={styles.text}>
                <Text style={styles.titleBold}>Technical Skills: </Text>
                {formData.skills}
              </Text>
            ) : null}

            {languagesText ? (
              <Text style={[styles.text, { marginTop: 4 }]}>
                <Text style={styles.titleBold}>Languages: </Text>
                {languagesText}
              </Text>
            ) : null}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {certificationList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.divider} />

            {certificationList.map((cert, i) => (
              <View key={i} style={styles.entry}>
                <Text style={styles.titleBold}>{cert.title || ""}</Text>

                <Text style={styles.text}>
                  {cert.issuer || ""}
                  {cert.year ? ` (${cert.year})` : ""}
                </Text>

                {cert.link ? (
                  <Link src={cert.link} style={styles.link}>
                    Certification Link
                  </Link>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};