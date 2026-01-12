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
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },

  /* HEADER */
  header: {
    alignItems: "center",
    marginBottom: 18,
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

  /* DIVIDER */
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginTop: 6,
    marginBottom: 14,
  },

  /* SECTIONS */
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },

  /* ENTRIES */
  entry: {
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  /* BULLETS */
  bullet: {
    fontSize: 10,
    marginLeft: 10,
    marginTop: 4,
    lineHeight: 1.4,
  },
});


export const ResumePDF = ({ formData }) => {
  // ✅ Normalize data safely
  const experienceList = formData.experience || [];
  const educationList = formData.education || [];
  const projectList = formData.projects || [];
  const certificationList = formData.certifications || [];

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
          <Text style={styles.name}>{formData.name}</Text>

          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{formData.email}</Text>
            <Text>|</Text>
            <Text style={styles.contactItem}>{formData.phone}</Text>
            <Text>|</Text>
            {formData.linkedIn && (
              <Link src={formData.linkedIn} style={styles.contactItem}>
                LinkedIn
              </Link>
            )}
            <Text>|</Text>
            {formData.github && (
              <Link src={formData.github} style={styles.contactItem}>
                GitHub
              </Link>
            )}
          </View>

          {formData.address && (
            <Text style={styles.address}>{formData.address}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* EDUCATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.divider} />
          {educationList.map((edu, i) => (
            <View key={i} style={styles.entry}>
              <View style={styles.rowBetween}>
                <Text style={styles.titleBold}>{edu.institution}</Text>
                <Text style={styles.meta}>{edu.year}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.text}>{edu.degree}</Text>
                {edu.cgpa && <Text style={styles.meta}>CGPA: {edu.cgpa}</Text>}
              </View>
            </View>
          ))}
        </View>

        {/* PROJECTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <View style={styles.divider} />
          {projectList.map((project, i) => (
            <View key={i} style={styles.entry}>
              <Text style={styles.titleBold}>{project.title}</Text>
              <Text style={styles.description}>{project.description}</Text>
              {project.technologies && (
                <Text style={styles.technologies}>
                  Technologies: {project.technologies}
                </Text>
              )}
              {project.link && (
                <Link src={project.link} style={styles.link}>
                  Project Link
                </Link>
              )}
            </View>
          ))}
        </View>

        {/* EXPERIENCE */}
        
        {experienceList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.divider} />
            {experienceList.map((exp, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.rowBetween}>
                  <Text style={styles.titleBold}>{exp.company}</Text>
                  <Text style={styles.meta}>{exp.duration}</Text>
                </View>
                <Text style={styles.text}>{exp.role}</Text>

                {/* ✅ Handle string responsibilities */}
                {exp.responsibilities && (
                  <Text style={styles.bullet}>
                    • {exp.responsibilities}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {(formData.skills || languagesText) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.divider} />
            {formData.skills && (
              <Text style={styles.text}>
                <Text style={styles.titleBold}>Technical Skills: </Text>
                {formData.skills}
              </Text>
            )}

            {languagesText && (
              <Text style={[styles.text, { marginTop: 4 }]}>
                <Text style={styles.titleBold}>Languages: </Text>
                {languagesText}
              </Text>
            )}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {certificationList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.divider} />
            {certificationList.map((cert, i) => (
              <View key={i} style={styles.entry}>
                <Text style={styles.titleBold}>{cert.title}</Text>
                <Text style={styles.text}>
                  {cert.issuer} {cert.year && `(${cert.year})`}
                </Text>
                {cert.link && (
                  <Link src={cert.link} style={styles.link}>
                    Certification Link
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
};
